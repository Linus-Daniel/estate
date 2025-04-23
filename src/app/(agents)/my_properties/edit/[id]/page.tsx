// src/app/(agents)/my_properties/edit/[id]/page.tsx
import EditProperty from "@/components/edit_property";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <EditProperty id={params.id} />;
}
