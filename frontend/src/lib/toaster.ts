import {toaster} from "@/components/ui/toaster.tsx";

export function ToasterError(message: string, description?: string, duration?: number) {
  const s = toaster.error({
    title: message,
    description: description,
    duration: duration,
    action: {
      label: "X",
      onClick: () => toaster.remove(s),
    },
  })
  return s;
}

export function ToasterSuccess(message: string, description?: string, duration?: number) {
  const s = toaster.success({
    title: message,
    description: description,
    duration: duration,
    action: {
      label: "X",
      onClick: () => toaster.remove(s),
    },
  })
  return s;
}

export function ToasterInfo(message: string, description?: string, duration?: number) {
  const s = toaster.create({
    type: 'info',
    title: message,
    description: description,
    duration: duration,
    action: {
      label: "X",
      onClick: () => toaster.remove(s),
    },
  })
  return s;
}

export function ToasterWarning(message: string, description?: string, duration?: number) {
  const s = toaster.create({
    type: 'warning',
    title: message,
    description: description,
    duration: duration,
    action: {
      label: "X",
      onClick: () => toaster.remove(s),
    },
  })
  return s;
}