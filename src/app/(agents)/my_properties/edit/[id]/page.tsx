import EditProperty from "@/components/edit_property";

export default function Page({ params }: { params: { id: string } }) {
  return <EditProperty id={params.id} />;
}
