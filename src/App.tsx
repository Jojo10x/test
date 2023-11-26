import React, { useEffect } from "react";
import "./App.css";
import { create } from "zustand";
import { Centrifuge } from "centrifuge";

interface CommunityState {
  audioLikes: number | null;
  updateAudioLikes: (audioLikes: number) => void;
}

const useCommunityStore = create<CommunityState>((set) => ({
  audioLikes: null,
  updateAudioLikes: (audioLikes) => {
    console.log("Updating audioLikes:", audioLikes);
    set({ audioLikes });
  },
}));

function App() {
  const handleClick = () => {
    window.open(
      "https://lo.ink/undefined/communities/categories/5/%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5",
      "_blank"
    );
  };

  useEffect(() => {
    const centrifuge = new Centrifuge(
      "wss://realtime.lo.ink:4444/connection/websocket",
      {
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJleHAiOjE3MDEyNjM1NjR9.eQqkRYLjyjVDdkhfI8Wg01kr_vNgFwiN5Dq6eaCY-pU",
      }
    );

    const sub = centrifuge.newSubscription("dev-union-4792", {
      token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFubmVsIjoiZGV2LXVuaW9uLTQ3OTIiLCJzdWIiOiIiLCJleHAiOjE3MDA4MzE1NjR9.SFPxVtE7vh-mZP_-fK2VfiVQqRNfSQiCoW8uLNbEJUU",
    });

    sub.on("publication", (ctx) => {
      console.log("Received data:", ctx.data);

      const audioLikes = ctx.data?.counters?.audioLikes;

      if (audioLikes !== undefined) {
        console.log("Received audioLikes:", audioLikes);
        useCommunityStore.getState().updateAudioLikes(audioLikes);
      } else {
        console.log("audioLikes property not found in publication data.");
      }
    });

    sub.subscribe();

    centrifuge.connect();

    return () => {
      sub.unsubscribe();
      centrifuge.disconnect();
    };
  }, []);

  const { audioLikes } = useCommunityStore.getState();

  console.log(
    "Current audioLikes:",
    audioLikes !== null ? audioLikes : "Loading..."
  );

  return (
    <div className="home">
      <div className="navy">
        <div className="logo_container">
          <div
            className="
        logo"
          ></div>
        </div>
      </div>
      <div className="info_container">
        <div className="info">
          <div className="img1"></div>
          <h1>Никита Чиров</h1>
          <div className="likes">
            {audioLikes !== null
              ? `Real-time Audio Likes for ${audioLikes}`
              : ""}
          </div>
          <button onClick={handleClick}>Открыть в LO</button>
        </div>
      </div>
    </div>
  );
};

export default App;

// Method for obtaining community data
//   const fetchCommunityData = () => {
//     fetch('https://apidev.lo.ink/v1/unions/4792?fields=counters,audioLikes')
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const audioLikes = data.data.counters.audioLikes;
//         setCommunityData({
//           audioLikes: audioLikes,
//         });
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   };

//   socket.on('connect', () => {
//     console.log('Connected to socket');
//   });

//   socket.on('communityUpdate', (data) => {
//     setCommunityData(data);
//   });

//   fetchCommunityData();

//   // Cleanup socket connection on component unmount
//   return () => {
//     socket.disconnect();
//   };
// }, [setCommunityData]);

// if (!communityData.audioLikes) {
//   return <div>Loading...</div>;
// }
