import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFlowsApi } from "../hooks/useFlowsApi";

const FlowPage: React.FC = () => {
  const { dpid } = useParams();
  const { data } = useFlowsApi(dpid);

  return (
    <div className="relative overflow-x-auto shadow-md h-full ">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>flow Number</th>
            <th>Priority</th>
            <th>packet_count</th>
            <th>Match</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.[1].map((flow, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td>{index + 1}</td>
              <td> { flow.priority } </td>
              <td>{flow.packet_count}</td>
              <td>
                {Object.entries(flow.match).map(([key, value]) => (
                  <p>
                    <span className="font-bold mr-2">{key}: </span> {value}
                  </p>
                ))}
              </td>
              <td>
                {flow.actions.map((action) => (
                  <p key={action}> {action}</p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlowPage;
