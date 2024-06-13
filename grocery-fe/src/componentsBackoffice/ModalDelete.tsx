import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Children } from "react";

const ModalDelete = (prop) => {
  return (
    <div>
      <div className={`fixed z-20 overflow-y-auto top-0 w-full left-0 bg-white border border-white dark:bg-boxdark ${prop.visible ? '' : 'hidden'}`} id="modal">
        <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-900 opacity-75">
            </div>
            <span className=" sm:inline-block sm:align-middle sm:h-screen">x​</span>
            <div className="z-30 w-fit relative inline-block border border-white align-center bg-white dark:bg-boxdark rounded-lg text-left overflow-hidden  shadow-xl transform transition-all sm:my-8 sm:align-middle" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                
                <div className="bg-white rounded-lg md:max-w-md p-4 fixed inset-x-0 bottom-0 z-50 md:relative">
                  <div className="md:flex items-center">
                    <div className="rounded-full border border-black flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                      {/* <i className="bx bx-error text-3xl"></i> */}
                      <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                      <p className="font-bold text-black">{prop.title}</p>
                      <p className="text-sm text-black mt-1">
                        {prop.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                    <button className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2" onClick={prop.onConfirm?.bind()}>
                      {prop.deleteButtonText}
                    </button>
                    <button className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
                      md:mt-0 md:order-1 hover:text-black" onClick={prop.onClose?.bind()}>Cancel</button>
                  </div>
                </div>

            </div>
            <div className="backdrop-blur-sm rounded bg-white/10 absolute h-full w-full top-0 left-0 z-20" onClick={prop.onClose?.bind()}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalDelete.defaultProps = {
  visible: true,
  title: "Hapus Data",
  description: "Apakah anda yakin ingin menghapus data ini?",
  deleteButtonText: "Ya, Hapus",
  onClose: () => {},
  onConfirm: () => {},
};

export default ModalDelete;
