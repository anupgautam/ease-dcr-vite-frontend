import { useState } from "react";

const PrelineSidenav = () => {

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
    };


    return (
        <>
            <div
                id="hs-application-sidebar"
                className="hs-overlay transition-all duration-300 transform w-[260px] h-full fixed inset-y-0 start-0 z-[60] bg-white border-e border-gray-200"
                role="dialog"
                tabIndex="-1"
                aria-label="Sidebar"
            >
                <div className="relative flex flex-col h-full">
                    <div className="px-6 pt-4 flex items-center">
                        <a
                            className="text-xl font-semibold focus:outline-none"
                            href="#"
                            aria-label="Preline"
                        >
                            {/* //! Logo */}
                            <img src="/assets/ease.png" height='180px' width='180px' alt="Ease SFA Logo" />
                        </a>
                    </div>

                    {/*//! Links  */}
                    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                        <nav className="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
                            <ul className="flex flex-col space-y-1">
                                <li>
                                    <a className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                        </svg>

                                        Dashboard
                                    </a>
                                </li>

                                <li>
                                    <button
                                        type="button"
                                        className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                        aria-expanded={isExpanded}
                                        aria-controls="account-accordion-child"
                                        onClick={toggleAccordion}
                                    >
                                        <svg
                                            className="shrink-0 mt-0.5 size-4"
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
                                            <circle cx="18" cy="15" r="3" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                                            <path d="m21.7 16.4-.9-.3" />
                                            <path d="m15.2 13.9-.9-.3" />
                                            <path d="m16.6 18.7.3-.9" />
                                            <path d="m19.1 12.2.3-.9" />
                                            <path d="m19.6 18.7-.4-1" />
                                            <path d="m16.8 12.3-.4-1" />
                                            <path d="m14.3 16.6 1-.4" />
                                            <path d="m20.7 13.8 1-.4" />
                                        </svg>
                                        Account

                                        <svg
                                            className={`ms-auto size-4 ${isExpanded ? "block" : "hidden"
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
                                            <path d="m18 15-6-6-6 6" />
                                        </svg>

                                        <svg
                                            className={`ms-auto size-4 ${isExpanded ? "hidden" : "block"
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

                                    <div
                                        id="account-accordion-child"
                                        className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${isExpanded ? "block" : "hidden"
                                            }`}
                                        role="region"
                                        aria-labelledby="account-accordion"
                                    >
                                        <ul className="ps-8 pt-1 space-y-1">
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                                    href="#"
                                                >
                                                    Link 1
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                                    href="#"
                                                >
                                                    Link 2
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                                    href="#"
                                                >
                                                    Link 3
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li>
                                    <a className="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 " href="#">
                                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                                        Calendar
                                    </a>
                                </li>

                                <li>
                                    <a className="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100  " href="#">
                                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                        Documentation
                                    </a>
                                </li>

                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PrelineSidenav