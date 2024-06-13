import { Product } from "../../types/product";
import ProductOne from "../../images/product/product-01.png";
import ProductTwo from "../../images/product/product-02.png";
import ProductThree from "../../images/product/product-03.png";
import ProductFour from "../../images/product/product-04.png";
import React from "react";

const TableTwo = (prop) => {
  // console.log(prop);
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {prop.title || "Data"}
        </h4>
				<div className="flex justify-end">
					{prop?.onAdd && (
						<button
							className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
							onClick={prop?.onAdd.bind(null)}
						>
							Tambah
						</button>
					)}
				</div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
										{prop.header.map((item, i) => {
											return (
												<th key={`${item.key}-${i}`} scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left  uppercase dark:" >
													{item.title}
												</th>
											);
										})}
										{!prop.hideAction && (
											<th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left  uppercase dark: text-end">
												Aksi
											</th>
										)}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
									{prop.data.map((row, i) => {
										return (
											<tr key={`row-${i}`} className="bg-gray-100 dark:bg-gray-700">
												{prop.header.map((item, i) => (
													<td key={i} className="py-4 px-6 text-sm font-medium  whitespace-nowrap dark:text-white bg-gray-100 dark:bg-boxdark">
														{item.render ? item.render(row) : row[item.key]}
													</td>
												))}

												{!prop.hideAction && (
													<td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap bg-gray-100 dark:bg-boxdark text-end">
														<div className="flex justify-end gap-4">
															{prop?.additionalAction.map((action, i) => {
																return (
																	<button
																		key={i}
																		className={`flex justify-center rounded ${action.color} py-2 px-6 font-medium text-gray hover:bg-opacity-90`}
																		onClick={action?.onClick?.bind(null, row)}
																	>
																		{action.label}
																	</button>
																);
															})}

															{prop?.onEdit && (
																<button
																	className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
																	onClick={prop?.onEdit?.bind(null, row)}
																>
																	Edit
																</button>
															)}
															{prop?.onDelete && (
																<button
																	className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-gray hover:bg-opacity-90"
																	onClick={prop?.onDelete?.bind(null, row)}
																>
																	Hapus
																</button>
															)}
															
														</div>
													</td>
												)}
											</tr>
										);
									})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TableTwo.defaultProps = {
  header: [],
  data: [],
	additionalAction: [],
	hideAction: false,
};

export default TableTwo;
