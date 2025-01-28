import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { VStack } from "@chakra-ui/react";
import { RegisterForm } from "@/components/form/RegisterForm.tsx";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster.tsx";
import { ToasterSuccess } from "@/lib/toaster.ts";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

export interface RegisterFormValues {
  username: string;
  password: string;
  confirm_password: string;
  email: string;
  confirm_email: string;
  birthdate: string;
}

interface RegisterResponse {
  error: {
    userName?: string;
    password?: string;
    mail?: string;
    birthDate?: string;
    server?: string;
  };
}

async function TryRegister(
  data: RegisterFormValues
): Promise<RegisterResponse> {
  try {
    const response = await fetch(
      "http://localhost:5163/auth/CreateNewAccount",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  } catch (e) {
    console.error(e);
    return { error: { server: "Erreur serveur" } };
  }
}
//
// async function TryRegisterAxios(
//   data: RegisterFormValues
// ): Promise<RegisterResponse> {
//   try {
//     const response = await axios.post(
//       "http://localhost:5163/auth/CreateNewAccount",
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     );
//     return response.json();
//   } catch (e) {
//     console.error(e);
//     return { error: { server: "Erreur serveur" } };
//   }
// }

function RouteComponent() {
  const form = useForm<RegisterFormValues>();
  const [isRegistered, setIsRegistered] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    const t = toaster.loading({ title: "Création de compte en cours..." });
    const result = await TryRegister(data);

    console.log(result);

    if (result.error) {
      result.error.userName &&
        toaster.error({
          title: "Erreur",
          description: result.error.userName,
        });
      result.error.password &&
        toaster.error({
          title: "Erreur",
          description: result.error.password,
        });
      result.error.mail &&
        toaster.error({ title: "Erreur", description: result.error.mail });
      result.error.birthDate &&
        toaster.error({
          title: "Erreur",
          description: result.error.birthDate,
        });
    } else {
      setIsRegistered(true);
      ToasterSuccess(
        "Compte créé !",
        "Veuillez vérifier votre boîte mail pour activer votre compte.",
        10000
      );
    }

    toaster.remove(t);
  });

  return (
    <VStack gap={6} align={"center"}>
      <RegisterForm onSubmit={onSubmit} form={form} />
      {isRegistered ? <Navigate to={"/auth/login"} /> : null}
    </VStack>
  );
}
