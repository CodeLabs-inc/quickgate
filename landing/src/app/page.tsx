export default function Home() {
  return (
    <div className="w-full h-full user-select-none">
      <video
        src="/background.mp4"
        style={{
          position: "absolute",     // Make it cover the screen
          top: 0,
          left: 0,
          width: "100vw",           // 100% of the viewport width
          height: "100vh",          // 100% of the viewport height
          objectFit: "cover",       // Ensures the video covers the screen without distortion
          zIndex: -1,                // Sends the video to the background
          opacity: 0.5
        }}
        muted
        loop
        autoPlay
      />



      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          borderRadius: "20px",

          
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          userSelect: "none",

        }}>

        <img src="/icon.png" alt="" style={{
          height: "100px",
          width: "100px",
          borderRadius: "20px",
        }}/>
        <div className="text-white user-select-none" style={{ fontSize: '80px', }}>QuickGate</div>
        <div className="text-white" style={{ fontSize: '17px', transform: 'translateY(-20px)', color: '#FFFFFF80', textTransform: 'uppercase' }}>El futuro de los parqueos intelligentes</div>

        <a
          href="https://testflight.apple.com/join/mKURaFJw"
          target="_blank"
          style={{
            width: "300px",
            padding: "20px 10px",
            borderRadius: "20px",
            backgroundColor: "#00000090",
            color: "#FFFFFF",
            backdropFilter: "blur(10px)",
            fontSize: "25px",
            cursor: "pointer",
            marginBottom: "5px",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px"
          }}
        >
          <svg fill="#ffffff" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 22.773 22.773">
            <g>
              <g>
                <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573
			c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"/>
                <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334
			c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0
			c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019
			c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464
			c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648
			c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"/>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
            </g>
          </svg>
          <p style={{fontSize: '15px', textTransform: 'uppercase', transform: 'translateY(2px)'}}>Descargar Beta</p>
        </a>
      </div>
    </div>
  );
}

