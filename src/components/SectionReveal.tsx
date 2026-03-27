import { useEffect, useRef, useState, type PropsWithChildren } from "react";

export default function SectionReveal({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={visible ? "animate-fade-up" : "opacity-0 translate-y-6"}>{children}</div>;
}
