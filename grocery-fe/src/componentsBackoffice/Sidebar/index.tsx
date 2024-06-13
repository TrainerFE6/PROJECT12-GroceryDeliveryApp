import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';
// import Logo from '../../assets/logo_grocery.png';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  const menuLinks = [
    {
      is_title: true,
      title: "MENU",
    },
    {
      is_title: false,
      title: "Dashboard",
      link: "/backoffice",
      icon: "fa-tachometer-alt",
      children: []
    },
    {
      is_title: false,
      title: "Master",
      link: "/backoffice/master",
      icon: "fa-box",
      children: [
        {
          title: "Pelanggan",
          link: "/backoffice/master/customer",
        },
        {
          title: "Kategori",
          link: "/backoffice/master/category",
        },
        {
          title: "Produk",
          link: "/backoffice/master/product",
        },
      ]
    },
    {
      is_title: false,
      title: "Transaksi",
      link: "/backoffice/transaction",
      icon: "fa-tachometer-alt",
      children: []
    },
  ];

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}
      
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-2 px-4 pb-4 lg:px-6">
          {/* <!-- Menu Group --> */}

          {menuLinks.map((menuLink, index) => (
            <div key={index+1}>


              {/* Title */}
              {menuLink.is_title && (
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {menuLink.title}
                </h3>
              )}

              {/* Menu tanpa children */}
              {!menuLink.is_title && !menuLink.children?.length && (
                <ul className="tes1 mb-2 flex flex-col gap-1.5">
                  <li>
                    <NavLink
                      to={menuLink.link || '/'}
                      className={`group relative flex items-center gap-2.5 rounded-[14px] px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-child-sidebar dark:hover:bg-meta-4 ${
                        pathname === menuLink.link && "bg-child-sidebar dark:bg-meta-4"
                      }`}
                    >
                      {/* <img
                        src={menuLink?.icon || '/images/icons/dashboard.svg'}
                        alt=""
                        width={24}
                        height={24}
                      /> */}
                      <FontAwesomeIcon icon={`fas ${menuLink?.icon || 'fa-tachometer-alt'}`} width={24} height={24} />
                      {menuLink.title}
                    </NavLink>
                  </li>
                </ul>
              )}

              {/* Menu dengan children */}
              {!menuLink.is_title && (menuLink.children && menuLink.children?.length > 0) && (
                <ul className="mb-1 flex flex-col gap-1.5">
                  <SidebarLinkGroup
                    activeCondition={ pathname.includes(menuLink.link || '') }
                  >

                    {(handleClick, open) => {

                      return (
                        <React.Fragment>
                          <NavLink
                            href="#"
                            className={`group relative flex items-center gap-2.5 rounded-[14px] px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-child-sidebar dark:hover:bg-meta-4 ${
                              ( pathname.includes(menuLink.link || '')) &&
                              "bg-child-sidebar dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <FontAwesomeIcon icon={`fas ${menuLink?.icon || 'fa-tachometer-alt'}`} width={24} height={24} />
                            {/* <img
                              src={menuLink?.icon || '/images/icons/dashboard.svg'}
                              alt=""
                              width={24}
                              height={24}
                            /> */}
                            {menuLink.title}
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && "rotate-180"
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </NavLink>

                          {/* <!-- Dropdown Menu Start --> */}
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && "hidden"
                            }`}
                          >
                            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                              { menuLink.children.map((menuLink, index) => (

                                <li key={'sub-menu-'+index}>
                                  <NavLink
                                    to={menuLink.link || '/'}
                                    className={`group relative flex items-center gap-2.5 rounded-[14px] px-4 py-2 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                      pathname === menuLink.link && "text-white"
                                    }`}
                                  >
                                    {/* <FontAwesomeIcon icon="fa-circle-dot" width={16} height={16} /> */}
                                    <span>&#8226;</span> 
                                    {menuLink.title}
                                  </NavLink>
                                </li>
                                
                              ))}
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                          
                        </React.Fragment>
                      );
                    }
                    
                  }
                  </SidebarLinkGroup>
                </ul>
              )}
            </div>
          ))}
          
          {/* End sidebar */}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>

    </aside>
  );
};

export default Sidebar;
