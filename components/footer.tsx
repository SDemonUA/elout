const feedbackLink =
  "https://docs.google.com/forms/d/e/1FAIpQLScI4T04foHH5PyGY-zXHb48hzjLUf30ZPxBipyE1dU3Gi4Z_A/viewform?usp=dialog";

export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto px-4 pb-4 flex flex-col sm:flex-row sm:justify-between items-center text-sm text-foreground/70">
      <div>Copyrights blah, blah... © 2025</div>
      <div>
        <a
          href={feedbackLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 hover:text-cyan-800 cursor-pointer"
        >
          Залишити відгук
        </a>
      </div>
    </footer>
  );
}
