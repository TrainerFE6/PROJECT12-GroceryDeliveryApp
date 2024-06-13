import { useEffect, useState } from 'react';
import instance from '../../../../https/core';
import toast from 'react-hot-toast';
import ModalConfirm from '../../../../componentsBackoffice/ModalConfirm';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableTwo from '../../../../componentsBackoffice/Tables/TableTwo';

const TransactionDetail = () => {
  const { id: product_id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [confirmPaymentStatus, setConfirmPaymentStatus] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState<any>({});
  const [newResi, setNewResi] = useState('');
  const tr = 'bg-gray-100 dark:bg-gray-700';
  const td = 'py-4 px-6 text-sm font-medium  whitespace-nowrap dark:text-white bg-gray-100 dark:bg-boxdark';

  const headerDetailTransaction = [
    {
      key: 'product',
      title: 'Produk',
    },
    {
      key: 'quantity',
      title: 'Jumlah',
    },
    {
      key: 'price',
      title: 'Harga',
      render: (item) => {
        return item.price.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        });
      },
    },
    {
      key: 'total',
      title: 'Total',
      render: (item) => {
        return item.subtotal.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        });
      },
    }
  ];
  const [transactionDetails, setTransactionDetails] = useState([]);

  const fetchData = async () => {
    try {
      const res = await instance.get('transaction/landing/read', { 
        params: {
          id: product_id
        }
       });
       setNewResi(res?.data?.shipping_receipt)
      setData(res.data)
      if (res?.data?.TransactionDetails) {
        setTransactionDetails(res.data.TransactionDetails.map((x) => {
          return {
            ...x,
            product: x.Product?.name,
          };
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const formatRupiah = (money: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(money);
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    const options: any = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    const formattedDate = d.toLocaleString('id-ID', options);
    return formattedDate;
  }

  const handleUpdateResi = async () => {
    try {
      if (!newResi) {
        toast.error('Resi pengiriman tidak boleh kosong');
        return;
      }
      if (newResi === data?.shipping_receipt) {
        toast.error('Resi pengiriman tidak boleh sama dengan sebelumnya');
        return;
      }

      const res = await instance.post('transaction/update/shipping-receipt', {
        id: product_id,
        shipping_receipt: newResi,
      });
      fetchData();
      toast.success('Berhasil update resi pengiriman');
    } catch (error) {
      console.log(error)
      toast.error('Gagal update resi pengiriman');
    }
  }

  const handlePressPaymentStatus = () => {
    setConfirmPaymentStatus(!confirmPaymentStatus);
  };

  const handleUpdatePaymentStatus = async () => {
    try {
      const res = await instance.post('transaction/update/payment-status', {
        id: product_id,
        payment_status: 'PAID',
      });
      setConfirmPaymentStatus(false);
      fetchData();
      toast.success('Berhasil update status pembayaran');
    } catch (error) {
      console.log(error)
      toast.error('Gagal update status pembayaran');
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <main className='min-h-screenpt-20 mb-9 px-25'>
      <div className="mt-20 p-4 flex">
        <div className="w-full text-xs">

          <div className="flex flex-col w-full gap-10">

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full">
              <div className="flex justify-between py-6 px-4 md:px-6 xl:px-7.5">
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex h-full justify-center items-center rounded bg-gray py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                  >
                    <FontAwesomeIcon icon="fa-solid fa-chevron-left" className="text-black" />
                  </button>
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Detail Transaksi
                  </h4>
                </div>
                <div className="flex justify-end">
                  {data.payment_status === 'UNPAID' && (
                    <a
                      href={`https://tripay.co.id/checkout/${data.payment_reference}`}
                      target='_blank'
                      className="flex justify-center items-center rounded bg-warning py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                    >
                      Bayar Sekarang
                    </a>
                  )}
                </div>
              </div>

              <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                  <tr className={tr}>
                    <td className={td}>Pelanggan</td>
                    <td className={td}>:</td>
                    <td className={td}>
                      {data?.Customer?.name || '-'} <br />
                      {data?.Customer?.address || '-'}, &nbsp;
                      {data?.Customer?.City?.name || '-'}, &nbsp;
                      {data?.Customer?.Province?.name || '-'}, &nbsp;
                      {data?.Customer?.City?.postal_code || '-'}, &nbsp;
                    </td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Nomor Invoice</td>
                    <td className={td}>:</td>
                    <td className={td}>{data.invoice_number || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Tanggal Pemesanan</td>
                    <td className={td}>:</td>
                    <td className={td}>{formatDate(data.date) || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Pembayaran</td>
                    <td className={td}>:</td>
                    <td className={td}>{data.PaymentMethod?.name || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Status Pembayaran</td>
                    <td className={td}>:</td>
                    <td className={td}>
                      <div className="flex gap-4 items-center">
                        <span>{data.payment_status || '-'}</span>
                      </div>
                    </td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Referensi Pembayaran</td>
                    <td className={td}>:</td>
                    <td className={td}>{data.payment_reference || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Ekspedisi</td>
                    <td className={td}>:</td>
                    <td className={td}>{data?.shipping_code?.toUpperCase() || '-'}, {data.shipping_service || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Resi Pengiriman</td>
                    <td className={td}>:</td>
                    <td className={td}>{data?.shipping_receipt || 'Menunggu Pengiriman'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Harga Produk</td>
                    <td className={td}>:</td>
                    <td className={td}>{formatRupiah(data?.product_price) || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Biaya Pengiriman</td>
                    <td className={td}>:</td>
                    <td className={td}>{formatRupiah(data?.shipping_price) || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Biaya Pembayaran</td>
                    <td className={td}>:</td>
                    <td className={td}>{formatRupiah(data?.payment_price) || '-'}</td>
                  </tr>
                  <tr className={tr}>
                    <td className={td}>Total</td>
                    <td className={td}>:</td>
                    <td className={td}>{formatRupiah(data?.total_price) || '-'}</td>
                  </tr>

                </table>
              </div>
            </div>

            <TableTwo title="Data Transaksi" header={headerDetailTransaction} data={transactionDetails || []} hideAction />

          </div>

        </div>
      </div>
    </main>
  );
};

export default TransactionDetail;
