export interface DataType {
  id: number;
  name: string;
}

export async function getData(): Promise<DataType> {
  const response = await fetch("/api", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'brian yao'
    })
  });
  const data = await response.json();
  return data;
}
