interface _ControlPanel {
  control0?:HTMLDivElement;
  control1?:HTMLDivElement;
  control2?:HTMLDivElement;
  control3?:HTMLDivElement;
  control4?:HTMLDivElement;
  control5?:HTMLDivElement;
}

interface _Card_Track {
    track?:HTMLDivElement;
      audio?:HTMLAudioElement;
      category:string;
      title:string;
      src:string;
      playButton?: HTMLButtonElement;
      playImage?: HTMLImageElement;
      status1?: HTMLLabelElement;
      status2?: HTMLLabelElement;
      controlPanel: _ControlPanel; 
      timer: number;
}

interface _NavControls {
  jumpFoward: HTMLButtonElement;
  jumpBack: HTMLButtonElement;
  prevTrack: HTMLButtonElement;
  nextTrack: HTMLButtonElement;
}
