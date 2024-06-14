import React from 'react';
import CardDataStats from '../../componentsBackoffice/CardDataStats';
import ChartOne from '../../componentsBackoffice/Charts/ChartOne';
import ChartThree from '../../componentsBackoffice/Charts/ChartThree';
import ChartTwo from '../../componentsBackoffice/Charts/ChartTwo';
import ChatCard from '../../componentsBackoffice/Chat/ChatCard';
import MapOne from '../../componentsBackoffice/Maps/MapOne';
import TableOne from '../../componentsBackoffice/Tables/TableOne';
import DefaultLayout from '../../layout/DefaultLayout';

const ECommerce: React.FC = () => {
  return (
    <DefaultLayout>

      <div className="mt-4 grid ">
        <ChartOne />
      </div>
    </DefaultLayout>
  );
};

export default ECommerce;
