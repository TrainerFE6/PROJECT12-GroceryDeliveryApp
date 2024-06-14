import React from "react";
import { Children } from "react";

const TableTwo = (prop) => {
  return (
    <div>
      <div className={`fixed z-20 overflow-y-auto top-0 w-full left-0 bg-white border border-white dark:bg-boxdark ${prop.visible ? '' : 'hidden'}`} id="modal">
        <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-900 opacity-75">
            </div>
            <span className=" sm:inline-block sm:align-middle sm:h-screen">x​</span>
            <div className="z-30 relative inline-block border border-white align-center bg-white dark:bg-boxdark rounded-lg text-left overflow-hidden  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              <div className=" pt-5 sm:px-6">
                <h1 className="text-2xl font-semibold text-gray-800">{prop.title}</h1>
              </div>
              <div className="bg-white dark:bg-boxdark px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-150 overflow-auto">
                {Children.map(prop.children, (child) => {
                  return child;
                })}
              </div>
            </div>
            <div className="backdrop-blur-sm rounded bg-white/10 absolute h-full w-full top-0 left-0 z-20" onClick={prop.onClose.bind()}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

TableTwo.defaultProps = {
  visible: false,
  isLoading: false,
  title: "Title",
};

export default TableTwo;
