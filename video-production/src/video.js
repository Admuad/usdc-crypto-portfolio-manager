const { Composition, Sequence, Audio, staticFile } = require('remotion');

// Video config
const FPS = 30;
const DURATION = 90; // 1.5 minutes

const DemoVideo = () => {
  return (
    <Composition
      id="DemoVideo"
      component={VideoComponent}
      durationInFrames={DURATION * FPS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};

const VideoComponent = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0F0B1C',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#F3F1FE'
    }}>
      {/* Audio tracks */}
      <Sequence from={0} durationInFrames={15 * FPS}>
        <Audio src={staticFile('audio1.mp3')} />
      </Sequence>
      <Sequence from={15 * FPS} durationInFrames={15 * FPS}>
        <Audio src={staticFile('audio2.mp3')} />
      </Sequence>
      <Sequence from={30 * FPS} durationInFrames={20 * FPS}>
        <Audio src={staticFile('audio3.mp3')} />
      </Sequence>
      <Sequence from={50 * FPS} durationInFrames={15 * FPS}>
        <Audio src={staticFile('audio4.mp3')} />
      </Sequence>
      <Sequence from={65 * FPS} durationInFrames={25 * FPS}>
        <Audio src={staticFile('audio5.mp3')} />
      </Sequence>
      
      {/* Scene 1: Intro */}
      <Sequence from={0} durationInFrames={15 * FPS}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80
        }}>
          <h1 style={{
            fontSize: 72,
            fontWeight: 800,
            marginBottom:的行 20,
            background: 'linear-gradient(90deg, #5925E6, #7E54F1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            USDC Stream DCA
          </h1>
          <p style={{
            fontSize: 28,
            color: '#66767D',
            maxWidth: 800,
            textAlign: 'center',
            lineHeight: 1.4
          }}>
            Continuous investing, continuous yield
          </p>
        </div>
      </Sequence>
      
      {/* Scene 2: Dashboard */}
      <Sequence from={15 * FPS} durationInFrames={15 * FPS}>
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(89, 37, 230, 0.05)'
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            textAlign: 'center'
          }}>
            🏛️ Institutional Dashboard
            <div style={{
              fontSize: 24,
              color: '#66767D',
              marginTop: 20
            }}>
              Live at: d69fce53ec50.ngrok-free.app
            </div>
          </div>
        </div>
      </Sequence>
      
      {/* Scene 3: Innovation */}
      <Sequence from={30 * FPS} durationInFrames={20 * FPS}>
        <div style={{
          height: '100%',
          padding: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 30,
            color: '#17854F'
          }}>
            Yield‑First Design
          </h2>
          <ul style={{
            fontSize: 32,
            lineHeight: 1.6,
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{marginBottom: 20}}>• Idle USDC → Aave V3 automatically</li>
            <li style={{marginBottom: 20}}>• Yield offsets gas costs</li>
            <li style={{marginBottom: 20}}>• Continuous streams, not periodic</li>
            <li>• Risk monitoring agent protects</li>
          </ul>
        </div>
      </Sequence>
      
      {/* Scene 4: Live Contracts */}
      <Sequence from={50 * FPS} durationInFrames={15 * FPS}>
        <div style={{
          height: '100%',
          padding: 60,
          backgroundColor: 'rgba(23, 133, 79, 0.1)'
        }}>
          <h2 style={{
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 40,
            color: '#E79E00'
          }}>
            Live on Sepolia
          </h2>
          <div style={{
            fontSize: 24,
            fontFamily: 'monospace',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 30,
            borderRadius: 12,
            overflowX: 'auto'
          }}>
            USDCStreamDCA: 0x858DE454D50de75cE1791E077Bc25c795D7B61B0<br/>
            MockUSDC: 0x6aB589D1D6A72060877EFA772CAcCCD8bAE09CEc<br/>
            PortfolioTracker: 0x81fFDe8F07139d5B4aC04189FC12c980D4030372
          </div>
        </div>
      </Sequence>
      
      {/* Scene 5: Call to Action */}
      <Sequence from={65 * FPS} durationInFrames={25 * FPS}>
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 60
        }}>
          <div style={{
            fontSize: 64,
            fontWeight: 800,
            marginBottom: 30,
            color: '#5925E6'
          }}>
            $10,000 Hackathon Goal
          </div>
          <div style={{
            fontSize: 32,
            color: '#66767D',
            marginBottom: 50,
            maxWidth: 900
          }}>
            Best OpenClaw Skill track • 10+ agent testers • Professional design
          </div>
          <div style={{
            fontSize: 28,
            backgroundColor: 'rgba(89, 37, 230, 0.2)',
            padding: '25px18px',
            borderRadius: 16,
            border: '2px solid #7E54F1'
          }}>
            <strong>Try it:</strong> claw skill install Admuad/usdc-crypto-portfolio-manager
          </div>
        </div>
      </Sequence>
    </div>
  );
};

module.exports = { DemoVideo };