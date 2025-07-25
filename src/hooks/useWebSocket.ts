import { useEffect, useRef } from 'react';
import { useGridStore } from '../store/gridStore';
import { GridRow } from '../types/grid';

export const useWebSocket = (url?: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { setWSConnected, updateRow, setRows, rows } = useGridStore();

  useEffect(() => {
    if (!url) return;

    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket(url);

        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setWSConnected(true);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'ROW_UPDATE':
                updateRow(data.payload.id, data.payload.data);
                break;
              case 'ROW_INSERT':
                setRows([...rows, data.payload]);
                break;
              case 'ROW_DELETE':
                const newRows = rows.filter(row => row.id !== data.payload.id);
                setRows(newRows);
                break;
              case 'BULK_UPDATE':
                setRows(data.payload);
                break;
              default:
                console.log('Unknown WebSocket message type:', data.type);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setWSConnected(false);
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWSConnected(false);
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        setWSConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        setWSConnected(false);
      }
    };
  }, [url, setWSConnected, updateRow, setRows, rows]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};