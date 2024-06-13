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
// import { process } from 'node';

type FormCustomer = {
  id?: number
  name: string
  email: string
  phone_number: string
  province_id: string
  city_id: string
  address: string
  password: string
}


const Customer = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [deleteID, setDeleteID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const header = [
    {
      key: 'name',
      title: 'Nama',
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'phone_number',
      title: 'No. HP',
    },
    {
      key: 'province_id',
      title: 'Provinsi',
      render  : (row) => {
        return row.Province?.name || '-'
      }
    },
    {
      key: 'city_id',
      title: 'Kota',
      render  : (row) => {
        return row.City?.name || '-'
      }
    },
    {
      key: 'address',
      title: 'Alamat',
    },
  ];
  const [data, setData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormCustomer>()

  const handleAdd = () => {
    console.log('Add');
    reset();
    setVisibleModal(!visibleModal)
  }
  
  const handleEdit = (row) => {
    console.log(row);
    reset();
    setValue('id', row.id);
    setValue('name', row.name);
    setValue('email', row.email);
    setValue('phone_number', row.phone_number);
    setValue('province_id', row.province_id);
    setValue('city_id', row.city_id);
    setValue('address', row.address);
    // setValue('password', row.password);
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
      // Fetch Province
      fetchProvince();

      const res = await instance.get('customers/list');
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProvince = async () => {
    try {
      const res = await instance.get('raja-ongkir/provinces');
      setProvinces(res.data.map((x) => {
        return {
          value: x.id,
          label: x.name
        }
      }))
    } catch (error) {
      // console.log(error)
    }
  }

  const fetchCity = async (province_id) => {
    try {
      setValue('city_id', '');
      setCities([]);

      const res = await instance.get(`raja-ongkir/cities?province_id=${province_id}`);
      setCities(res.data.map((x) => {
        return {
          value: x.id,
          label: `${x.type} ${x.name}`
        };
      }));
    } catch (error) {
      // console.log(error)
    }
  }

  const onSubmit: SubmitHandler<FormCustomer> = async (data) => {
    try {
      const payload = {
        id: data?.id,
        ...data
      }
      if (!data.password) delete payload.password

      const proccess = async () => {
        setIsLoading(true)
        if (!data.id) await instance.post('customers/create', payload);
        else await instance.post('customers/update', payload);
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
      setIsLoading(false)
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
        await instance.post('customers/delete', { id: deleteID });
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
      <Breadcrumb pageName="Pelanggan" />
      <div className="flex flex-col gap-10">
        <TableTwo title="Data Pelanggan" header={header} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Modal title={`${watch('id') ? 'Ubah' : 'Tambah'} Pelanggan`} visible={visibleModal} isLoading={isLoading} onClose={handleModalClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="font-medium text-gray-800">Nama</label>
          <input
            type="text"
            defaultValue=""
            {...register("name")}
            placeholder='Nama Pelanggan'
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />
          <label className="font-medium text-gray-800">Email</label>
          <input
            type="text"
            defaultValue=""
            {...register("email")}
            placeholder='Email'
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />
          <label className="font-medium text-gray-800">No. HP</label>
          <input
            type="text"
            defaultValue=""
            {...register("phone_number")}
            placeholder='No. HP'
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />

          <label className="font-medium text-gray-800">Provinsi</label>
          <select
            {...register("province_id")}
            onChange={(e) => fetchCity(e.target.value)}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="font-medium text-gray-800">Kota</label>
          <select
            {...register("city_id")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          >
            <option value="">Pilih Kota</option>
            {cities.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="font-medium text-gray-800">Alamat</label>
          <input
            type="text"
            defaultValue=""
            {...register("address")}
            placeholder='Alamat'
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />
          <label className="font-medium text-gray-800">Password</label>
          <input
            type="password"
            defaultValue=""
            {...register("password")}
            placeholder='Password'
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />

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

export default Customer;
