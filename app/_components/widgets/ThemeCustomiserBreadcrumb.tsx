import Link from "next/link";

const ThemeCustomerBreadCrumb = ({ isEditingTheme }: { isEditingTheme: string | null }) => {
  return (
    <nav className="mb-6 flex items-center gap-1 text-sm text-gray-700">
      <Link
        href="/dashboard"
        className="text-gray-700 hover:underline"
      >
        Dashboard
      </Link>
      {isEditingTheme ? (
        <>
          <span className="px-1">/</span>
          <Link
            href="/customise-theme"
            className="text-gray-700 hover:underline"
          >
            Create new theme
          </Link>
          <span className="px-1">/</span>
          <span className="text-gray-500">Update Theme</span>
        </>
      ) : (
        <>
          <span className="px-1">/</span>
          <span className="text-gray-500">Create new theme</span>
        </>
      )}
    </nav>
  );
};

export default ThemeCustomerBreadCrumb;
