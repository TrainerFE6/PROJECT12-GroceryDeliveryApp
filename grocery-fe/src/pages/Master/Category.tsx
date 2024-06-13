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
// import { process } from 'node';

type FormCategory = {
  id?: number
  name: string
  file: any
}

const Category = () => {
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
      key: 'name',
      title: 'Nama',
    }
  ];
  const [data, setData] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormCategory>()

  const handleAdd = () => {
    console.log('Add');
    reset();
    setVisibleModal(!visibleModal)
  }
  
  const handleEdit = (row) => {
    console.log(row);
    setValue('id', row.id);
    setValue('name', row.name);
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
      const res = await instance.get('categories/list');
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit: SubmitHandler<FormCategory> = async (data) => {
    try {
      if (!data.file) {
        toast.error('Gambar harus diisi')
        return;
      }
      
      const payload = {
        id: data?.id,
        name: data.name,
        ...data.file,
        size: '' + `${data.file.size}`,
      }

      const proccess = async () => {
        setIsLoading(true)
        if (!data.id) await instance.post('categories/create', payload);
        else await instance.post('categories/update', payload);
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
      setIsLoading(false)
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
        await instance.post('categories/delete', { id: deleteID });
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
      if (error && error.message) {
        toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    if (data.length === 0) {
      fetchData()
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kategori" />
      <div className="flex flex-col gap-10">
        <TableTwo title="Data Kategori" header={header} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Modal title={`${watch('id') ? 'Ubah' : 'Tambah'} Kategori`} visible={visibleModal} isLoading={isLoading} onClose={handleModalClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="font-medium text-gray-800">Nama</label>
          <input
            type="text"
            defaultValue=""
            {...register("name")}
            placeholder='Nama Kategori'
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />

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

export default Category;
