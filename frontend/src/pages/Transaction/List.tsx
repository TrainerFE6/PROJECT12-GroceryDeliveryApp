import { useEffect, useState } from 'react';
import Breadcrumb from '../../componentsBackoffice/Breadcrumbs/Breadcrumb';
import TableOne from '../../componentsBackoffice/Tables/TableOne';
import TableThree from '../../componentsBackoffice/Tables/TableThree';
import TableTwo from '../../componentsBackoffice/Tables/TableTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import Modal from '../../componentsBackoffice/Modal';
import { set, useForm } from 'react-hook-form';
import instance from '../../https/core';
import FormInput from '../../componentsBackoffice/Forms/FormInput';
import toast, { Toaster } from 'react-hot-toast';
import { asset, baseUrl } from '../../url';
import ModalDelete from '../../componentsBackoffice/ModalDelete';
import React from 'react';
import { render } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Transaction = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const header = [
    {
      key: 'date',
      title: 'Tanggal',
    },
    {
      key: 'invoice_number',
      title: 'Nomor Invoice',
    },
    {
      key: 'customer_name',
      title: 'Pelanggan',
    },
    {
      key: 'total',
      title: 'Total',
      render  : (item) => {
        return item.total_price.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        });
      }
    },
    {
      key: 'payment_status',
      title: 'Pembayaran',
    },
    {
      key: 'shipping_receipt',
      title: 'Pengiriman',
      render: (item) => {
        if (item.shipping_receipt) {
          return (
            <>
              <div className="flex justify-center">
                <FontAwesomeIcon icon="fa-solid fa-circle-check" className='text-success' />
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="flex justify-center">
              <FontAwesomeIcon icon="fa-solid fa-circle-info" className='text-warning' />
              </div>
            </>
          );
        }
        // return item.shipping_receipt || '-';
      }
    },
  ];
  const additionalAction = [
    {
      label: "Detail",
      color: "bg-warning",
      onClick: (row) => {
        console.log("Gambar", row);
        navigate(`/backoffice/transaction/detail/${row.id}`);
      },
    },
  ];

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await instance.get('transaction/list');
      setData(res.data.map((item) => {
        return {
          ...item,
          customer_name: item?.Customer?.name || '-',
        }
      }))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (data.length === 0) {
      fetchData()
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Transaksi" />
      <div className="flex flex-col gap-10">
        <TableTwo title="Data Transaksi" header={header} data={data} additionalAction={additionalAction} />
      </div>
    </DefaultLayout>
  );
};

export default Transaction;
