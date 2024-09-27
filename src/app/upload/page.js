"use client";

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Upload() {
    const router = useRouter();
  const { data: session, status } = useSession();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {status === 'unauthenticated' ? (<p className="text-2xl font-bold text-gray-900 dark:text-white">Authenticating...</p>) : (
        <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Upload File</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">Upload MCLs, SSWBs, and other documents.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 dark:text-gray-300" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-gray-900 dark:text-white">{message}</p>}
      </>
      )}
    </div>
  );
}