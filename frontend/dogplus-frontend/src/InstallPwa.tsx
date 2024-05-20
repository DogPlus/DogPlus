import React, { useEffect, useState } from 'react';

const InstallPWA: React.FC = () => {
  const [showModal, setShowModal] = useState(localStorage.getItem('installed') !== 'true');
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  
  const isIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
  }


  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        localStorage.setItem('installed', 'true');
        setDeferredPrompt(null);
      });
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
        localStorage.setItem('installed', 'true');
        setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div onClick={handleCloseModal} className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto mt-20 p-5 border w-96 shadow-lg rounded-md bg-white">

            <button 
              onClick={handleCloseModal} 
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900">
              <i className="fas fa-times"></i> 
            </button>
            
            <p>Dog+ can be installed app to get the best possible experience!</p>

            {isIOS() && (
              <p className="text-sm text-gray-500">On IOS, tap the share button and select "Add to Home Screen".</p>
            )}
            {!isIOS() && (
              <div>
                <p className="text-sm text-gray-500">Click the button below to install the app.</p>
                <button onClick={handleInstallClick} className="mt-4 bg-blue-500 text-white p-2 rounded">
                  Install App
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;
