import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map((link) => {
      return (
        <li key={link.label} className="nav-item">
          <Link href={link.href} className="navbar-brand">
            {link.label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
