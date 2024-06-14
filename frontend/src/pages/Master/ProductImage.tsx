import { useEffect, useState } from 'react';
import Breadcrumb from '../../componentsBackoffice/Breadcrumbs/Breadcrumb';
import TableOne from '../../componentsBackoffice/Tables/TableOne';
import TableThree from '../../componentsBackoffice/Tables/TableThree';
import TableTwo from '../../componentsBackoffice/Tables/TableTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import Modal from '../../componentsBackoffice/Modal';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import instance from '../../https/core';
import FormInput from '../../componentsBackoffice/Forms/FormInput';
import toast, { Toaster } from 'react-hot-toast';
import { asset, baseUrl } from '../../url';
import ModalDelete from '../../componentsBackoffice/ModalDelete';
import { useParams } from 'react-router-dom';
import { render } from 'react-dom';
import React from 'react';
// import { process } from 'node';

type FormProductImage = {
  id?: number
  file: any
}

const ProductImage = () => {
  const { id: product_id } = useParams<{ id: string }>();
  const [visibleModal, setVisibleModal] = useState(false);
  const [deleteID, setDeleteID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const header = [
    {
      key: 'path',
      title: 'Gambar',
      render: (row) => {
        return (
          <img src={asset(row.path)} alt="gambar" className="w-10 h-10" />
        )
      }
    },
    {
      key: 'originalname',
      title: 'Nama File',
    },
    {
      key: 'size',
      title: 'Ukuran',
      render: (row) => {
        const size = parseFloat(row.size);
        const i = Math.floor(Math.log(size) / Math.log(1024));
        const sizeHuman = `${(size / (1024 ** i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
        return (
          <span>{sizeHuman}</span>
        )
      }
    },
  ];
  const [data, setData] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormProductImage>()

  const handleAdd = () => {
    console.log('Add');
    reset();
    setVisibleModal(!visibleModal)
  }
  
  const handleEdit = (row) => {
    console.log(row);
    setValue('id', row.id);
    setValue('file', {
      fieldname: row.fieldname,
      originalname: row.originalname,
      encoding: row.encoding,
      mimetype: row.mimetype,
      destination: row.destination,
      filename: row.filename,
      path: row.path,
      size: row.size,
    });
    setVisibleModal(true)
  }

  const handleDelete = async (row) => {
    setDeleteID(row.id);
  }

  const handleModalClose = () => {
    console.log('close')
    reset();
    setVisibleModal(false)
  }

  const handleModalDeleteClose = () => {
    console.log('close')
    setDeleteID(0);
  }

  const fetchData = async () => {
    try {
      const product = await instance.get('products/read', { params: { id: product_id } });
      const res = await instance.get('Product_image/list', { params: { product_id: product_id } });
      
      setDataProduct(product.data)
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit: SubmitHandler<FormProductImage> = async (data) => {
    try {
      if (!data.file) {
        toast.error('Gambar harus diisi')
        return;
      }
      const payload = {
        id: data?.id,
        product_id: product_id,
        ...data.file,
        size: '' + `${data.file.size}`,
      }

      const proccess = async () => {
        setIsLoading(true)
        if (!data.id) await instance.post('Product_image/create', payload);
        else await instance.post('Product_image/update', payload);
        setIsLoading(false)
      }

      await toast.promise(
        proccess(),
         {
           loading: 'Menyimpan...',
           success: <b>Operasi berhasil!</b>,
           error: <b>Operasi Gagal.</b>,
         }
      );
      
      setVisibleModal(false)
      fetchData()
    } catch (error) {
      console.log(error)
      if (error?.details?.length) {
        error.details.forEach((err) => {
          toast.error(err.message)
        })
      }
    }
  }

  const onDelete = async () => {
    try {
      const proccess = async () => {
        await instance.post('Product_image/delete', { id: deleteID });
      }

      await toast.promise(
        proccess(),
         {
           loading: 'Menghapus...',
           success: <b>Data berhasil dihapus!</b>,
           error: <b>Data gagal dihapus.</b>,
         }
      );

      setDeleteID(0);
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (data.length === 0) {
      fetchData()
    }
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Gambar Produk" />
      <div className="flex flex-col gap-10">
        <TableTwo title={`Data Gambar (${dataProduct.name})`} header={header} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Modal title={`${watch('id') ? 'Ubah' : 'Tambah'} Gambar Produk`} visible={visibleModal} isLoading={isLoading} onClose={handleModalClose}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <label className="font-medium text-gray-800">Gambar</label>
          <FormInput onChange={(val) => setValue("file", val) } />

          <div className="bg-gray-200  py-3 text-right">
            <button type="submit" disabled={isLoading} className="py-2 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-700 transition duration-500">
              
              {isLoading ? 'Loading...' : (watch('id') ? 'Ubah' : 'Tambah')}
            </button>
          </div>
        </form>
      </Modal>
      <ModalDelete visible={deleteID} onClose={handleModalDeleteClose} onConfirm={onDelete} />
    </DefaultLayout>
  );
};

export default ProductImage;
