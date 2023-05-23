import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory';

const SalesReport = props => {
  const [orders, setOrders] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState({});

  const fetchData = async () => {
    const res = await fetch('/api/order/order');
    const orders = await res.json();
    const sortedOrders = orders.sort((a, b) => {
      const monthA = Number(a.dateOfPayment.slice(0, 4) + a.dateOfPayment.slice(5, 7));
      const monthB = Number(b.dateOfPayment.slice(0, 4) + b.dateOfPayment.slice(5, 7));
      return monthA - monthB;
    });
    setOrders(sortedOrders);
  
    const monthlyTotal = {};
    sortedOrders.forEach(order => {
      const date = new Date(order.dateOfPayment);
      const month = `${date.getFullYear()}-${date.getMonth()+1}`;
      if (monthlyTotal[month]) {
        monthlyTotal[month] += order.total;
      } else {
        monthlyTotal[month] = order.total;
      }
    });
    setMonthlyTotal(monthlyTotal);
  }
  

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Sales Report</h1>
      {Object.keys(monthlyTotal).length > 0 ? (
        <VictoryChart domainPadding={20}>
          <VictoryAxis
            label="Month"
            tickValues={Object.keys(monthlyTotal)}
            tickFormat={x => {
              const date = new Date(`${x}-01`);
              return date.toLocaleString('default', { month: 'long' })
            }}
          />
          <VictoryAxis
            label="Total"
            dependentAxis
          />
          <VictoryBar
            data={Object.keys(monthlyTotal).map(month => ({x: month, y: monthlyTotal[month]}))}
            labels={({ datum }) => `$${datum.y}`}
            labelComponent={<VictoryLabel dy={-15} />}
          />
        </VictoryChart>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default SalesReport;
