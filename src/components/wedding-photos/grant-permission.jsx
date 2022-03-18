import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Container = styled.div``;

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2em 2em;
`;

const Table = styled.table`
  border-collapse: collapse;

  th {
    padding: 0.5em;
  }

  td {
    padding: 0.3em 0.5em;
  }

  th,
  td {
    border: 1px solid lightgrey;
  }

  tr:nth-child(odd) {
    td {
      background-color: white;
    }
  }

  tr:nth-child(even) {
    td {
      background-color: #f5f5f5;
    }
  }
`;

const Button = styled.button`
  padding: 1em 1em;
  width: 100%;
`;

const fetcher = async (setPermissionRequests) => {
  try {
    const res = await axios.get('/api/wedding_photo_access');

    setPermissionRequests(
      res.data
        .map((a) => JSON.parse(a))
        .sort((a, b) => b.requestTimestamp - a.requestTimestamp)
    );
  } catch (e) {
    throw e;
  }
};

export default function GrantPermission() {
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [ipFilter, setIpFilter] = useState([]);

  useEffect(() => {
    fetcher(setPermissionRequests);
  }, []);

  useEffect(() => {
    const reqIps = permissionRequests.map((a) => a.ipAddress);

    setIpFilter(
      reqIps.reduce((prev, curr) => {
        prev[curr] = true;
        return prev;
      }, {})
    );
  }, [permissionRequests]);

  return (
    <Container>
      <h2>Wedding Permission Manager</h2>
      <p>
        {permissionRequests.length} total requests to view the wedding album
      </p>
      <TwoColumns>
        <div>
          <p>IP Addresses</p>
          {Object.entries(ipFilter).map((a) => {
            const [ip, checked] = a;
            return (
              <div key={`ipfilter-${ip}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setIpFilter((prev) => {
                      return {
                        ...prev,
                        [ip]: !prev[ip],
                      };
                    });
                  }}
                />
                &nbsp;<span>{ip}</span>
              </div>
            );
          })}
        </div>
        <Table>
          <thead>
            <tr>
              <th>Grant</th>
              <th>Message</th>
              <th>IP</th>
              <th>Date</th>
              <th>Ago</th>
            </tr>
          </thead>
          <tbody>
            {permissionRequests.map((permission) => {
              const permissionDay = dayjs(permission.requestTimestamp);
              return (
                ipFilter[permission.ipAddress] && (
                  <tr key={permission.key}>
                    <td>
                      <Button
                        onClick={async () => {
                          if (
                            confirm(
                              `Grant access to: "${
                                permission.message
                              }" from ${permissionDay.format('D MMM YYYY')}`
                            )
                          ) {
                            await axios.post(
                              `/api/wedding_photo_access/${permission.key}`,
                              { grantAccess: 'yes' }
                            );
                            fetcher(setPermissionRequests);
                          }
                        }}
                      >
                        Grant
                      </Button>
                    </td>
                    <td
                      style={{ maxWidth: '20vw', overflowWrap: 'break-word' }}
                    >
                      {permission.message}
                    </td>
                    <td>
                      <a
                        href={`https://api.ipfind.com/?ip=${permission.ipAddress}`}
                        target="_blank"
                      >
                        {permission.ipAddress}
                      </a>
                    </td>
                    <td>{permissionDay.format('D MMM YYYY')}</td>
                    <td>{permissionDay.fromNow()}</td>
                  </tr>
                )
              );
            })}
          </tbody>
        </Table>
      </TwoColumns>
    </Container>
  );
}
