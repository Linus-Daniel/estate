import EditProperty from "@/components/edit_property";
import { type Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Edit Property ${params.id}`,
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <EditProperty id={params.id} />;
}
