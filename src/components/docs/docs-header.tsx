interface DocsHeaderProps {
  title: string;
  description: string;
}

export function DocsHeader({ title, description }: DocsHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
