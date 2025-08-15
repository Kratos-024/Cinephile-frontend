import { Menu } from "./Menu";

export const Container = ({ 
  children, 
  showMenu = false, 
  menu, 
  menuHandler 
}: { 
  children: React.ReactNode;
  showMenu?: boolean;
  menu?: boolean;
  menuHandler?: () => void;
}) => {
  return (
    <div className="max-w-full w-full">
      {showMenu && menu !== undefined && menuHandler && (
        <Menu menu={menu} />
      )}
      {children}
    </div>
  );
};
