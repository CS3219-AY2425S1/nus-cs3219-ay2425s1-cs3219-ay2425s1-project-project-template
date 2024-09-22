import Header from "@/components/ui/Header";

interface ContainerProps {
  withHeader?: boolean; // Lazy way to handle adding of headers to pages that need them
  children: React.ReactNode;
}

const Container = ({ withHeader = true, children }: ContainerProps) => {
  return (
    <div className="p-10">
      {withHeader && <Header />}
      {children}
    </div>
  );
};

export default Container;
