import { Link, useMatches } from "react-router-dom";

type Handle = {
  breadcrumb?: (match: any) => string;
  icon: any
};

export default function Breadcrumbs() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => (match.handle as Handle)?.breadcrumb)
    .map((match) => {
      const handle = match.handle as Handle;


      return {
        pathname: match.pathname,
        label: handle.breadcrumb?.(match),
        Icon: handle.icon
      };
    });

  return (
    <nav>
      <ol className="flex items-center gap-2 text-sm ">
        {crumbs.map((crumb, index) => (
          <li key={crumb.pathname} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            {index === crumbs.length - 1 ? (
              <span className="font-medium flex items-center gap-2">
                {crumb.Icon && <crumb.Icon size={14} />}
                {crumb.label}
              </span>
            ) : (
              <Link 
                to={crumb.pathname}
                className="hover:text-secondary-foreground transition flex items-center gap-2"
              >
                {crumb.Icon && <crumb.Icon size={14} />}
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
