import React, { useEffect, useState } from 'react';

const InstallPWA: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    setShowModal(deferredPrompt !== null);
  }, [deferredPrompt]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
          setShowModal(false);
      }
  };

  return (
    <>
      {showModal && (
        <div onClick={handleCloseModal} className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto mt-20 p-5 border w-96 shadow-lg rounded-md bg-white">

            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900">
              <i className="fas fa-times"></i> 
            </button>
            
            <p>Dog+ can be installed app to get the best possible experience!</p>

            <div>
              <button onClick={handleInstallClick} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Install App
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;
