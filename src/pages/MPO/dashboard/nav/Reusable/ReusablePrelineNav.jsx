import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const ReusablePrelineNav = ({ logoSrc, links }) => {
    const [expandedAccordion, setExpandedAccordion] = useState(null);
    const { pathname } = useLocation();
    console.log(pathname);

    const toggleAccordion = (label) => {
        setExpandedAccordion(expandedAccordion === label ? null : label);
    };

    return (
        <div
            id="hs-application-sidebar"
            className="transition-all duration-300 transform w-[260px] h-full fixed inset-y-0 start-0 z-[60] bg-white border-e border-gray-200"
            role="dialog"
            tabIndex={-1}
            aria-label="Sidebar"
        >
            <div className="relative flex flex-col h-full">
                <div className="px-6 pt-4 flex items-center">
                    <Link
                        className="text-xl font-semibold focus:outline-none"
                        to="/"
                        aria-label="Preline"
                    >
                        <img src={logoSrc} alt="Logo" className="h-12 w-12" />
                    </Link>
                </div>

                <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                    <nav className="p-3 w-full flex flex-col flex-wrap">
                        <ul className="flex flex-col space-y-1">
                            {links.map((link, index) => (
                                <li key={index}>
                                    {link.path ? (
                                        <Link
                                            to={link.path}
                                            className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg ${pathname.includes(link.path)
                                                ? "text-[#2065d1]"  // Text color when active
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            className={`w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg ${expandedAccordion === link.label
                                                ? "bg-gray-100 text-gray-800"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            onClick={() => toggleAccordion(link.label)}
                                        >
                                            {link.icon}
                                            {link.label}
                                            <svg
                                                className={`ms-auto size-4 transition-transform ${expandedAccordion === link.label ? "rotate-180" : ""
                                                    }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </button>
                                    )}

                                    {expandedAccordion === link.label && (
                                        <div
                                            className="ps-8 pt-1 space-y-1"
                                            role="region"
                                            aria-labelledby={link.label}
                                        >
                                            {link.children?.map((child, childIndex) => (
                                                <Link
                                                    key={childIndex}
                                                    to={child.path}
                                                    className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg ${pathname.includes(child.path)
                                                            ? "text-[#2065d1]" // Text color when active
                                                            : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {child.icon}
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ReusablePrelineNav;
