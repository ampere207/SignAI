import '../App.css'
import React, { useState, useEffect, useRef } from "react";
import Slider from 'react-input-slider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import xbot from '../Models/xbot/xbot.glb';
import ybot from '../Models/ybot/ybot.glb';
import xbotPic from '../Models/xbot/xbot.png';
import ybotPic from '../Models/ybot/ybot.png';

import * as words from '../Animations/words';
import * as alphabets from '../Animations/alphabets';
import { defaultPose } from '../Animations/defaultPose';
import { normalizeWordToken, normalizePhraseToken, queueSpelledWord } from '../Animations/spellWord';
import { exactPhraseAnimations } from '../Animations/phrases';

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const exactWordAnimations = words.exactWordAnimations || {};
const supportedWordList = new Set(words.wordList || []);
const phraseKeys = Object.keys(exactPhraseAnimations || {}).sort((left, right) => right.length - left.length);

function Convert() {
  const [text, setText] = useState("");
  const [bot, setBot] = useState(ybot);
  const [speed, setSpeed] = useState(0.1);
  const [pause, setPause] = useState(800);

  const componentRef = useRef({});
  const { current: ref } = componentRef;

  const textFromAudio = useRef(null);
  const textFromInput = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {

    ref.flag = false;
    ref.pending = false;

    ref.animations = [];
    ref.characters = [];

    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0x0f1020);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);
    ref.renderer = new THREE.WebGLRenderer({ antialias: true });

    ref.camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth * 0.57 / (window.innerHeight - 70),
        0.1,
        1000
    )
    ref.renderer.setSize(window.innerWidth * 0.57, window.innerHeight - 70);

    document.getElementById("canvas").innerHTML = "";
    document.getElementById("canvas").appendChild(ref.renderer.domElement);

    ref.camera.position.z = 1.6;
    ref.camera.position.y = 1.4;

    let loader = new GLTFLoader();
    loader.load(
      bot,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ( child.type === 'SkinnedMesh' ) {
            child.frustumCulled = false;
          }
    });
        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);
        defaultPose(ref);
      },
      (xhr) => {
        console.log(xhr);
      }
    );

  }, [ref, bot]);

  ref.animate = () => {
    if(ref.animations.length === 0){
        ref.pending = false;
      return ;
    }
    requestAnimationFrame(ref.animate);
    if(ref.animations[0].length){
        if(!ref.flag) {
          if(ref.animations[0][0]==='add-text'){
            setText((prevText) => prevText + ref.animations[0][1]);
            ref.animations.shift();
          }
          else{
            for(let i=0;i<ref.animations[0].length;){
              let [boneName, action, axis, limit, sign] = ref.animations[0][i]
              if(sign === "+" && ref.avatar.getObjectByName(boneName)[action][axis] < limit){
                  ref.avatar.getObjectByName(boneName)[action][axis] += speed;
                  ref.avatar.getObjectByName(boneName)[action][axis] = Math.min(ref.avatar.getObjectByName(boneName)[action][axis], limit);
                  i++;
              }
              else if(sign === "-" && ref.avatar.getObjectByName(boneName)[action][axis] > limit){
                  ref.avatar.getObjectByName(boneName)[action][axis] -= speed;
                  ref.avatar.getObjectByName(boneName)[action][axis] = Math.max(ref.avatar.getObjectByName(boneName)[action][axis], limit);
                  i++;
              }
              else{
                  ref.animations[0].splice(i, 1);
              }
            }
          }
        }
    }
    else {
      ref.flag = true;
      setTimeout(() => {
        ref.flag = false
      }, pause);
      ref.animations.shift();
    }
    ref.renderer.render(ref.scene, ref.camera);
  }

  const sign = (inputRef) => {
    const rawInput = inputRef.current.value;
    const normalizedPhrase = normalizePhraseToken(rawInput);
    const matchedPhrase = phraseKeys.find((phrase) => phrase === normalizedPhrase);

    if (matchedPhrase) {
      setText('');
      exactPhraseAnimations[matchedPhrase](ref);
      return;
    }

    var str = rawInput.toUpperCase();
    var strWords = str.split(' ');
    setText('')

    for(let word of strWords){
      const normalizedWord = normalizeWordToken(word);

      if (!normalizedWord) {
        continue;
      }

      if(exactWordAnimations[normalizedWord]){
        ref.animations.push(['add-text', normalizedWord + ' ']);
        exactWordAnimations[normalizedWord](ref);
        continue;
      }

      if (supportedWordList.has(normalizedWord)) {
        queueSpelledWord(normalizedWord, ref, alphabets);
        continue;
      }

      queueSpelledWord(normalizedWord, ref, alphabets);
    }
  }

  const startListening = () =>{
    SpeechRecognition.startListening({continuous: true});
  }

  const stopListening = () =>{
    SpeechRecognition.stopListening();
  }

  return (
    <main className="convert-page">
      <section className="page-shell page-hero">
        <p className="page-kicker">SignAI Translation Hub</p>
        <h1 className="page-title">Text and Audio to Indian Sign Language</h1>
        <p className="page-subtitle">
          Type a phrase or speak into the microphone to animate ISL gestures inside the same SignAI product shell.
        </p>
        <div className="status-row">
          <div className="status-chip">
            Speech recognition <strong>{listening ? 'on' : 'ready'}</strong>
          </div>
          <div className="status-chip">
            Runtime <strong>localhost:5000</strong>
          </div>
        </div>
      </section>

      <section className="page-shell container-fluid">
        <div className="row g-4 align-items-stretch">
          <div className="col-md-3">
            <label className='label-style'>
              Processed Text
            </label>
            <textarea rows={3} value={text} className='w-100 input-style' readOnly />
            <label className='label-style'>
              Speech Recognition: {listening ? 'on' : 'off'}
            </label>
            <div className='space-between'>
              <button className="btn btn-primary btn-style w-33" onClick={startListening}>
                Mic On <i className="fa fa-microphone"/>
              </button>
              <button className="btn btn-primary btn-style w-33" onClick={stopListening}>
                Mic Off <i className="fa fa-microphone-slash"/>
              </button>
              <button className="btn btn-primary btn-style w-33" onClick={resetTranscript}>
                Clear
              </button>
            </div>
            <textarea rows={3} ref={textFromAudio} value={transcript} placeholder='Speak or paste text here ...' className='w-100 input-style' />
            <button onClick={() => {sign(textFromAudio)}} className='btn btn-primary w-100 btn-style btn-start'>
              Start Animations
            </button>
            <label className='label-style'>
              Text Input
            </label>
            <textarea rows={3} ref={textFromInput} placeholder='Type text here ...' className='w-100 input-style' />
            <button onClick={() => {sign(textFromInput)}} className='btn btn-primary w-100 btn-style btn-start'>
              Start Animations
            </button>
          </div>
          <div className='col-md-7'>
            <div className="convert-panel convert-panel--canvas">
              <div id='canvas'/>
            </div>
          </div>
          <div className='col-md-2'>
            <p className='bot-label'>
              Select Avatar
            </p>
            <img src={xbotPic} className='bot-image col-md-11' onClick={()=>{setBot(xbot)}} alt='Avatar 1: XBOT'/>
            <img src={ybotPic} className='bot-image col-md-11' onClick={()=>{setBot(ybot)}} alt='Avatar 2: YBOT'/>
            <p className='label-style'>
              Animation Speed: {Math.round(speed*100)/100}
            </p>
            <Slider
              axis="x"
              xmin={0.05}
              xmax={0.50}
              xstep={0.01}
              x={speed}
              onChange={({ x }) => setSpeed(x)}
              className='w-100'
            />
            <p className='label-style'>
              Pause time: {pause} ms
            </p>
            <Slider
              axis="x"
              xmin={0}
              xmax={2000}
              xstep={100}
              x={pause}
              onChange={({ x }) => setPause(x)}
              className='w-100'
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Convert;