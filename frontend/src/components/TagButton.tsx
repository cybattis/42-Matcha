import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

export function TagButton(props: { name: string }) {
  const [selected, setSelected] = useState(false);

  return (
    <Button
      as={Checkbox}
      variant={selected ? "solid" : "outline"}
      size={"xs"}
      onClick={() => {
        setSelected(!selected);
      }}
    >
      {props.name}
    </Button>
  );
}
