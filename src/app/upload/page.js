"use client";

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button'

export default function Upload() {
    const router = useRouter();
  const { data: session, status } = useSession();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState({
    streetNumber: '',
    streetName: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [cleansedAddress, setCleansedAddress] = useState(null);
  const [error, setError] = useState(null);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    console.log(address);
    e.preventDefault();
    setError(null);
    setCleansedAddress(null);

    try {
      const response = await fetch('/api/cleanse-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to cleanse address');
      }

      const data = await response.json();
      if (data.length > 0) {
        const cleansed = data[0];
        console.log(cleansed);
        const standardizedAddress = {
          deliveryLine1: cleansed.delivery_line_1,
          lastLine: cleansed.last_line,
          components: cleansed.components,
        };
        console.log(standardizedAddress);
        setCleansedAddress(standardizedAddress);
      } else {
        throw new Error('No candidates');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
        // router.push('/login');
        // signIn('google', { callbackUrl: router.asPath });
    }
  }, [session, status]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Failed to upload file.');
      }
    } catch (error) {
      setMessage('An error occurred while uploading the file.');
    }
  };
  
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Upload File</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">Upload MCLs, SSWBs, and other documents.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 dark:text-gray-300" />
        <Button type="submit" text="Upload" />
      </form>
      {message && <p className="mt-4 text-gray-900 dark:text-white">{message}</p>}
      <div className="mt-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Address Cleansing Testing</h1>
        <form onSubmit={handleAddressSubmit} className="space-y-4 flex flex-col">
          <div className="flex flex-row w-full justify-between items-center">
            <input type="text" name="streetNumber" value={address.streetNumber} onChange={handleAddressChange} placeholder="Enter street number" className="w-full text-sm text-gray-900 dark:text-gray-300 h-10 p-2 mr-2 rounded-md shadow-md"/>
            <input type="text" name="streetName" value={address.streetName} onChange={handleAddressChange} placeholder="Enter street name" className="w-full text-sm text-gray-900 dark:text-gray-300 h-10 p-2 rounded-md shadow-md"/>
          </div>
          <div className="flex flex-row w-full justify-between items-center">
            <input type="text" name="city" value={address.city} onChange={handleAddressChange} placeholder="Enter city" className="w-full text-sm text-gray-900 dark:text-gray-300 h-10 p-2 mr-2 rounded-md shadow-md"/>
            <input type="text" name="state" value={address.state} onChange={handleAddressChange} placeholder="Enter state" className="w-full text-sm text-gray-900 dark:text-gray-300 h-10 p-2 mr-2 rounded-md shadow-md"/>
            <input type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} placeholder="Enter zip code" className="w-full text-sm text-gray-900 dark:text-gray-300 h-10 p-2 rounded-md shadow-md"/>
          </div>
        <Button type="submit" text="Cleanse" />
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {cleansedAddress && (
          <div>
            <h3>Standardized Address:</h3>
            <p>{cleansedAddress.deliveryLine1.toUpperCase()}</p>
            <p>{cleansedAddress.lastLine.toUpperCase()}</p>
            <button onClick={() => setShowJson(!showJson)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">Show/Hide JSON</button>
            {showJson && <pre>{JSON.stringify(cleansedAddress, null, 2)}</pre>}
          </div>
        )}

        <div className="mt-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Bulk Address Cleansing Testing</h1>
          <textarea className="w-full text-sm text-gray-900 dark:text-gray-300 min-h-40 p-2 shadow-lg" />
          <Button type="submit" text="Cleanse" />
        </div>
      </div>
    </div>
  );
}