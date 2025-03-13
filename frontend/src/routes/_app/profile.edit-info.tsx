import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { MyRooterContext } from '@/routes/__root.tsx'
import { ToasterSuccess } from '@/lib/toaster.ts'
import { useForm } from 'react-hook-form'
import { toaster } from '@/components/ui/toaster.tsx'
import { VStack } from '@chakra-ui/react'
import { EditProfileForm } from '@/components/form/EditProfileForm.tsx'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileStatus, Tags, UserProfile } from '@/lib/interface.ts'
import { FetchTagsList, UpdateProfile } from '@/lib/query.ts'
import { useAuth } from '@/auth.tsx'
import { useContext } from 'react'
import { UserContext } from '@/routes/_app.tsx'

export const Route = createFileRoute('/_app/profile/edit-info')({
  component: RouteComponent,
  loader: async ({ context }: { context: MyRooterContext }) => {
    return await FetchTagsList(context.auth)
  },
})

const formSchema = z.object({
  firstName: z.string().nonempty({
    message: 'First name is required',
  }),
  lastName: z.string().nonempty({
    message: 'Last name is required',
  }),
  gender: z.number(),
  sexualOrientation: z.number(),
  biography: z.string(),
  coordinates: z.string(),
  address: z.string(),
  tags: z.array(z.string()),
})
export type UserProfileFormValue = z.infer<typeof formSchema>

function RouteComponent() {
  const auth = useAuth()
  const navigate = useNavigate({ from: Route.fullPath })
  const profile = useContext(UserContext)?.user as UserProfile
  const tags = Route.useLoaderData() as Tags[]

  const form = useForm<UserProfileFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      biography: profile.biography,
      tags: profile.tags ? Object.values(profile.tags) : [],
    },
  })

  const onSubmit = form.handleSubmit(async (data: UserProfileFormValue) => {
    const isCreation = profile.status !== ProfileStatus.COMPLETED

    console.log(data)
    const t = toaster.loading({
      title: isCreation
        ? 'Création de compte en cours...'
        : 'Mise à jour du profil en cours...',
    })
    const token = localStorage.getItem('token')
    const result = await UpdateProfile(token, data)
    toaster.remove(t)

    console.log('RESULT:', result.statusText)

    if (result.status === 401) {
      await auth.logout()
      redirect({
        to: '/auth/login',
      })
      return
    }

    if (result.status === 200) {
      ToasterSuccess(result.data)
      if (!isCreation) await navigate({ to: '/profile/me/edit-images' })
      else await navigate({ to: '/profile/me' })
    }
  })

  return (
    <VStack gap={6} align={'center'}>
      <EditProfileForm
        profile={profile}
        form={form}
        onSubmit={onSubmit}
        tagsData={tags}
      />
    </VStack>
  )
}
