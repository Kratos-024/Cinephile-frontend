import { Container } from "./Container";

interface LayoutWithMenuProps {
  children: React.ReactNode;
  menu: boolean;
  menuHandler: () => void;
}

export const LayoutWithMenu = ({ children, menu, menuHandler }: LayoutWithMenuProps) => {
  return (
    <Container showMenu={true} menu={menu} menuHandler={menuHandler}>
      {children}
    </Container>
  );
};
