import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="wrap">
        <Link href="/" className="logo">
          Emilie
        </Link>
        <nav>
          <ul>
            <li>
              <Link href="/projects">Works</Link>
            </li>
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <Link href="/#shop">Shop</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
