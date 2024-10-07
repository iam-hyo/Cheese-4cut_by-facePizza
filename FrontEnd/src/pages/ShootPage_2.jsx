import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmotionDetection } from '../hooks/useEmotionDetection';
import * as S from '../styles/commonStyle';
import * as Sho from '../styles/shootStyle';
import CurrentFaceEx from '../hooks/CurrentFaceEx';
import shoot2_illust from '../assets/shoot2_illust.png'
import Modal from '../commponents/shoot/Modal';
import LoadingPage from './LoadingPage';



const ShootPage_2 = ({ setCapturedPhotos, capturedPhotos }) => {
    const [modalVisible, setModalVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
    const [flash, setFlash] = useState(false); // 플래시 효과를 위한 상태
    const [currentEmotion, setCurrentEmotion] = useState(null);
    const [timer, setTimer] = useState(8); // 타이머 상태 (10초부터 시작) //테스트 1초
    const videoRef = useRef(null);
    const canvasRef = useRef(null); // 캔버스를 참조하기 위한 useRef
    const navigate = useNavigate();
    const { detectEmotion } = useEmotionDetection();
    const [isDetecting, setIsDetecting] = useState(true); // 감정 on/off 컨트롤
    const [lastCapturedPhoto, setLastCapturedPhoto] = useState(null); //마지막 촬영된 사진 보여주기

    const TranslatedCurrentEmotion = {
        happy: '행복',
        sad: '슬픔',
        angry: '분노',
        surprised: '놀람',
        neutral: "무표정",
        fearful: "두려움",
        disgusted: "혐오",
    };
    const translatedEmotion = currentEmotion ? TranslatedCurrentEmotion[currentEmotion.expression] || '인식되지 않음' : '???';


    // 비디오 로드
    useEffect(() => {
        if (!videoRef || !videoRef.current) {
            console.log("videoRef가 전달되지 않았습니다.");
            return;
        }

        const startVideo = () => {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => {
                    console.log("비디오 스트림 접근 오류: ", err); // 오류 로그 추가
                });
        };

        startVideo();
    }, [isDetecting]);

    // 감정 인식 수행
    useEffect(() => {
        const detectEmotionFromVideo = async () => {
            if (!videoRef.current || !isDetecting) return;

            const detectedEmotion = await detectEmotion(videoRef.current); // 감정 인식 수행
            setCurrentEmotion(detectedEmotion); // 감정 결과를 상태에 저장
        };

        const interval = setInterval(detectEmotionFromVideo, 200); // 0.2초마다 감정 인식 수행

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
    }, [detectEmotion, isDetecting]); // 감정 인식 훅을 의존성으로 설정



    //로딩상태를 관리하는 함수_ 현재 오류로인해 사용X
    const handleLoadingPage = () => {
        setIsLoading(false);
    };


    //사진 촬영 함수
    const capturePhoto = () => {
        console.log("canvasRef:", canvasRef.current);
        console.log("videoRef:", videoRef.current);

        if (!canvasRef.current || !videoRef.current) {
            console.log("캔버스 또는 비디오 요소가 초기화되지 않았어yo");
            return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // 캔버스 크기를 비디오 크기에 맞추기
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // 비디오 영상을 좌우 반전하여 캔버스에 그리기
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(
            videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight
        );

        // 텍스트를 캔버스에 추가 (비디오 위에 글씨)
        context.resetTransform(); // 좌우 반전을 원상복구
        context.font = "50px omyu pretty"; // 원하는 폰트 설정
        context.fillStyle = "black"; // 글자 색상
        context.textAlign = "center";
        context.fillText(translatedEmotion, canvas.width / 2, 69);

        //사진 촬영 후 상태에 저장하는 함수
        const handlePhotoTaken = (photo) => {
            setCapturedPhotos((prevPhotos) => [...prevPhotos, { photo }]);
        };

        const photo = canvas.toDataURL("image/jpeg");    //캔버스의 사진을 url형태로 photo변수에 저장
        setFlash(true); // 캡처 후 플래시 효과 실행
        setTimeout(() => setFlash(false), 200); // 0.2초 후 플래시 효과 해제
        handlePhotoTaken(photo);

        setLastCapturedPhoto(photo); // 방금 찍힌 사진을 상태에 저장하여 보여줌
        setIsDetecting(false); // 감정 인식 중지

        setTimeout(() => {
            setIsDetecting(true); // 2초 후 감정 인식 재개
            setLastCapturedPhoto(null); // 2초 후 비디오로 돌아감
            setCurrentEmotion(null);
        }, 2000);
    };

    useEffect(() => {
        if (capturedPhotos.length === 8) {
            navigate('/select'); // "/select" 경로로 이동
        }
    }, [capturedPhotos.length, navigate]);


    return (
        <Sho.ShootPage2>
            <Modal modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <Sho.CurrentH1>{translatedEmotion}</Sho.CurrentH1>
            <S.CenterRowBox style={{ gap: '50px', margin: '0' }}>
                <Sho.LeftDatabox >
                    <h3 id='sec'>{timer}s</h3>
                    <h3 id='sequence'>{capturedPhotos.length}/8</h3>
                </Sho.LeftDatabox>
                {lastCapturedPhoto ? (<img
                    src={lastCapturedPhoto}
                    alt="lastCaptured"
                    style={{
                        width: 775.5,
                        height: 945,
                        objectFit: "cover",
                        // transform: 'rotateY(180deg)'
                    }}
                />
                ) : (<video
                    ref={videoRef}
                    autoPlay
                    onLoadedData={handleLoadingPage}
                    style={{
                        width: '74.25vh',
                        height: '99vh',
                        objectFit: "cover",
                        transform: 'rotateY(180deg)'
                    }}
                />)}

                <canvas ref={canvasRef} style={{ display: "none" }} />
                <Sho.FlashOverlay flash={flash} />
                <Sho.RightDatabox >
                    <h3 id='tip'>다양한 표정을 지어보세요</h3>

                    <Sho.CharactImg src={shoot2_illust} style={{ width: '283px' }} />

                </Sho.RightDatabox>
            </S.CenterRowBox>

            <CurrentFaceEx
                translatedEmotion={translatedEmotion || '인식되지 않음'}
                timer={timer}
                setTimer={setTimer}
                capturePhoto={capturePhoto}
                modalVisible = {modalVisible}
            />
        </Sho.ShootPage2>
    );
};

export default ShootPage_2;
