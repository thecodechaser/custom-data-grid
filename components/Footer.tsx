export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex justify-center w-full text-sm text-sky-200" style={{marginTop: '-30px'}}>
      <p>
        © {year} Custom Data Grid. All rights reserved.{" "}
        <a
          href="https://thecodechaser.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          thecodechaser.com
        </a>
      </p>
    </footer>
  );
};