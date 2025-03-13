import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {FileUploadDropzone, FileUploadRoot} from '@/components/ui/file-upload'
import {AspectRatio, Flex, Grid, Image} from '@chakra-ui/react'
import {ToasterError} from '@/lib/toaster.ts'
import {useContext, useEffect, useState} from 'react'
import {CloseButton} from '@/components/ui/close-button.tsx'
import {TrashIcon} from '@/components/Icons.tsx'
import {Button} from '@/components/ui/button.tsx'
import {
  DeleteImage,
  DownloadImage,
  UploadToServer,
  ValidateProfile,
} from '@/lib/query.ts'
import {UserContext} from "@/routes/_app.tsx";
import {UserProfile} from "@/lib/interface.ts";

export const Route = createFileRoute('/_app/profile/edit-images')({
  component: RouteComponent,
})

function UploadImageComponent({
                                imageName,
                                position,
                              }: {
  imageName?: string
  position: number
}) {
  const [isHovering, setIsHovering] = useState(false)
  const [onDelete, setOnDelete] = useState(false)
  const [image, setImage] = useState<string>('')

  useEffect(() => {
    if (!imageName)
      return
    
    DownloadImage(imageName).then((data) => {
      setImage(data)
    })
  }, [])

  return (
    <FileUploadRoot
      position={'relative'}
      maxW="500px"
      alignItems="stretch"
      maxFiles={1}
      accept={['image/png', 'image/jpeg']}
      maxFileSize={5000000}
      onFileAccept={async (file) => {
        if (!file.files[0]) {
          return
        }
        console.log('file accepted', file)
        console.log('Position', position)

        // upload file
        const result = await UploadToServer(file.files[0], position)
        if (result) {
          await DownloadImage(result).then((data) => {
            setImage(data)
          })
        }
      }}
      onFileReject={(files) => {
        if (!files.files[0]) {
          return
        }

        files.files[0].errors.forEach((error) => {
          if (error === 'FILE_INVALID_TYPE') {
            ToasterError('Invalid file type')
          } else if (error === 'FILE_TOO_LARGE') {
            ToasterError('File is too large')
          } else {
            ToasterError(error)
          }
        })
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={onDelete}
    >
      <AspectRatio ratio={1}>
        <FileUploadDropzone
          padding={image ? 0 : 4}
          label="Drag and drop here to upload"
          description=".png, .jpg up to 5MB"
        >
          {image ? (
            <>
              {isHovering ? (
                <CloseButton
                  position={'absolute'}
                  variant="solid"
                  top={5}
                  right={5}
                  onMouseEnter={() => setOnDelete(true)}
                  onMouseLeave={() => setOnDelete(false)}
                  onClick={async () => {
                    await DeleteImage(position)
                    .then(() => {
                      setOnDelete(false)
                      setImage('')
                    })
                    .catch((err) => {
                      console.log(err)
                    })
                  }}
                >
                  <TrashIcon/>
                </CloseButton>
              ) : null}
              <Image
                src={image}
                alt="Image"
                w={'100%'}
                h={'100%'}
                fit={'cover'}
              />
            </>
          ) : null}
        </FileUploadDropzone>
      </AspectRatio>
    </FileUploadRoot>
  )
}

function RouteComponent() {
  const navigate = useNavigate({from: Route.fullPath})
  const profile = useContext(UserContext)?.user as UserProfile

  return (
    <Grid gap="4" p="4">
      <Flex gap="4" wrap="wrap" justifyContent="center" alignItems="center">
        <UploadImageComponent imageName={profile.images[0]} position={1}/>
        <UploadImageComponent imageName={profile.images[1]} position={2}/>
        <UploadImageComponent imageName={profile.images[2]} position={3}/>
        <UploadImageComponent imageName={profile.images[3]} position={4}/>
        <UploadImageComponent imageName={profile.images[4]} position={5}/>
      </Flex>
      <Button
        justifySelf={'center'}
        maxW={75}
        onClick={async () => {
          const result = await ValidateProfile()
          if (result) {
            await navigate({
              to: '/home',
            })
          }
        }}
      >
        Save
      </Button>
    </Grid>
  )
}
