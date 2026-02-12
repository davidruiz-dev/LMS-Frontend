import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

export default function NotFoundPage() {
  const onClick = () => window.history.back();
  
  return (
    <div className="h-screen flex items-center justify-center">
      <Empty className="">
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            La página que buscas no existe. Intenta navegando otras páginas.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            <a onClick={onClick}>Regresar</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
};
