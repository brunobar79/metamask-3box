const setStatus = (msg) => {
  console.log(msg);
}
window.toNative = function(msg){
  window.ReactNativeWebView.postMessage(
          JSON.stringify(msg)
  );
};
window.ethereumPendingCallbacks = {};
window.ethereum = {
  sendAsync: (payload, callback) => {
      if (!window.ReactNativeWebView.postMessage) {
          alert('Bridge not ready');
      }   
      const random = Math.floor(Math.random() * 100 + 1);
      const fullPayload = {
          ...payload,
          __mmID: Date.now() * random,
          hostname: window.location.hostname
      };
      window.ethereumPendingCallbacks[`${fullPayload.__mmID}`] = callback;
      window.toNative({
          payload: fullPayload,
          type: 'PROVIDER'
      });
  },
  _onMessage: (data) =>{
      try {
          const payload = typeof data === 'string' ? JSON.parse(data) : data;
          const { __mmID, error, response } = payload;
          const callback = window.ethereumPendingCallbacks[`${__mmID}`];
          callback && callback(error, response);
          delete window.ethereumPendingCallbacks[`${__mmID}`];
      } catch (error) {
          alert(error.toString()); // eslint-disable-line no-console
      }
  }
}
window.openBox = async (address) => {
  try{
      setStatus('Opening box ', address);
      window.Box.openBox(address.toLowerCase(), window.ethereum, {}).then(box => {
          window.box = box;
          box.onSyncDone((res) => {
              console.log('Sync Complete');
              window.toNative({
                  payload: {
                      status: 'box_open'
                  },
                  type: 'STATE_UPDATE'
              });
              setStatus('Box open');
          })
      }).catch( e => {
    console.log('something broke', e);
    window.toNative({
      payload: {
        status: 'box_open',
        error: true,
        result: e.toString()
      },
      type: 'STATE_UPDATE'
    });
    return false;
      });
      setStatus('Syncing box...');
      return true;
      
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'box_open',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }
}
window.openSpace = async (spaceName) => {
  try{
      setStatus(`Opening space ${spaceName}`);
      window.space = await window.box.openSpace(spaceName, {
          onSyncDone: () => {
              setStatus('Space synced');
          }
      });
      window.toNative({
          payload: {
              status: 'space_open'
          },
          type: 'STATE_UPDATE'
      });
      setStatus('Space open');
      return true;
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'space_open',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }
}

window.spacePublicSet = async (key, value) => {
  try{
      window.toNative({
          payload: {
              status: 'idle'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Public space writing ${key} => ${value}`);
      
      await window.space.public.set(key, value);
      
      window.toNative({
          payload: {
              status: 'public_write_end'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Public space wrote ${key} => ${value}`);
      
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'public_write_end',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }        
}

window.spacePublicGet = async (key) => {
  try{
      window.toNative({
          payload: {
              status: 'idle'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Public space getting ${key}`);
      
      const value = await window.space.public.get(key);
      
      window.toNative({
          payload: {
              status: 'public_get_end',
              result: value
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Public space got ${key} => ${value}`);
      
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'public_get_end',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }        
}

window.spacePrivateSet = async (key, value) => {
  try{
      window.toNative({
          payload: {
              status: 'idle'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Private space writing ${key} => ${value}`);
      
      await window.space.private.set(key, value);
      
      window.toNative({
          payload: {
              status: 'private_write_end'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Private space wrote ${key} => ${value}`);
      
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'private_write_end',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }        
}

window.spacePrivateGet = async (key) => {
  try{
      window.toNative({
          payload: {
              status: 'idle'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Private space getting ${key}`);
      
      const value = await window.space.private.get(key);
      
      window.toNative({
          payload: {
              status: 'private_get_end',
              result: value
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Private space got ${key} => ${value}`);
      
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'private_get_end',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }        
}

window.spacePublicRemove = async (key) => {
  try{
      window.toNative({
          payload: {
              status: 'idle'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Public space removing ${key}`);
      
      await window.space.public.remove(key);
      
      window.toNative({
          payload: {
              status: 'public_remove_end'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Public space removed ${key}`);
      
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'public_remove_end',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }        
}

window.spacePrivateRemove = async (key) => {
  try{
      window.toNative({
          payload: {
              status: 'idle'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Private space removing ${key}`);
      
      const value = await window.space.private.remove(key);
      
      window.toNative({
          payload: {
              status: 'private_remove_end'
          },
          type: 'STATE_UPDATE'
      });
      
      setStatus(`Private space removed ${key}`);
      
  } catch(e){
      console.log('something broke', e);
      window.toNative({
          payload: {
              status: 'private_remove_end',
              error: true,
              result: e.toString()
          },
          type: 'STATE_UPDATE'
      });
      return false;
  }        
}