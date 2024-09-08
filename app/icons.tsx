const RightChevron = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
)

const FocusIcon = ({ size = 32, color = 'rgb(37 99 235)' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
    >
      <desc>Focus 2 Streamline Icon: https://streamlinehq.com</desc>
      <path
        fill="#000000"
        d="M15.333333333333332 16a0.6666666666666666 0.6666666666666666 0 1 0 1.3333333333333333 0 0.6666666666666666 0.6666666666666666 0 1 0 -1.3333333333333333 0"
        strokeWidth="2"
      ></path>
      <path
        d="M6.666666666666666 16a9.333333333333332 9.333333333333332 0 1 0 18.666666666666664 0 9.333333333333332 9.333333333333332 0 1 0 -18.666666666666664 0"
        strokeWidth="2"
      ></path>
      <path d="m16 4 0 2.6666666666666665" strokeWidth="2"></path>
      <path d="m4 16 2.6666666666666665 0" strokeWidth="2"></path>
      <path d="m16 25.333333333333332 0 2.6666666666666665" strokeWidth="2"></path>
      <path d="m25.333333333333332 16 2.6666666666666665 0" strokeWidth="2"></path>
    </svg>
  );

  const DeleteIcon = ({ size = 32, color = 'rgb(37 99 235)' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-1 -1 20 20" id="Delete-Bin-2--Streamline-Micro" height="20" width="20">
      <desc>Delete Bin 2 Streamline Icon: https://streamlinehq.com</desc>
      <path stroke={color} stroke-linecap="round" stroke-linejoin="round" d="M1.35 4.5072h15.3" stroke-width="2"></path>
      <path stroke={color} stroke-linecap="round" stroke-linejoin="round" d="M13.05 17.1h-8.1a1.8 1.8 0 0 1 -1.8 -1.8v-10.8h11.700000000000001v10.8a1.8 1.8 0 0 1 -1.8 1.8Z" stroke-width="2"></path>
      <path stroke={color} stroke-linecap="round" stroke-linejoin="round" d="M5.774400000000001 4.5v-0.4122a3.1877999999999997 3.1877999999999997 0 1 1 6.3755999999999995 0V4.5" stroke-width="2"></path>
      <path stroke={color} stroke-linecap="round" stroke-linejoin="round" d="M7.1802 8.1v5.4" stroke-width="2"></path>
      <path stroke={color} stroke-linecap="round" stroke-linejoin="round" d="M10.827 8.1v5.4" stroke-width="2"></path>
    </svg>
 );
  
const TodoIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="rgb(37 99 235)" stroke-linecap="round" stroke-linejoin="round" id="List-Check--Streamline-Tabler" height="32" width="32"><desc>List Check Streamline Icon: https://streamlinehq.com</desc><path d="M4.666666666666666 7.333333333333333 6.666666666666666 9.333333333333332l3.333333333333333 -3.333333333333333" stroke-width="2"></path><path d="M4.666666666666666 15.333333333333332 6.666666666666666 17.333333333333332l3.333333333333333 -3.333333333333333" stroke-width="2"></path><path d="M4.666666666666666 23.333333333333332 6.666666666666666 25.333333333333332l3.333333333333333 -3.333333333333333" stroke-width="2"></path><path d="m14.666666666666666 8 12 0" stroke-width="2"></path><path d="m14.666666666666666 16 12 0" stroke-width="2"></path><path d="m14.666666666666666 24 12 0" stroke-width="2"></path></svg>
)
export {
    RightChevron,
    FocusIcon,
    TodoIcon,
    DeleteIcon
}


<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" id="Focus-2--Streamline-Tabler" height="16" width="16"><desc>Focus 2 Streamline Icon: https://streamlinehq.com</desc><path fill="#000000" d="M7.1875 7.5a0.3125 0.3125 0 1 0 0.625 0 0.3125 0.3125 0 1 0 -0.625 0" stroke-width="1"></path><path d="M3.125 7.5a4.375 4.375 0 1 0 8.75 0 4.375 4.375 0 1 0 -8.75 0" stroke-width="1"></path><path d="m7.5 1.875 0 1.25" stroke-width="1"></path><path d="m1.875 7.5 1.25 0" stroke-width="1"></path><path d="m7.5 11.875 0 1.25" stroke-width="1"></path><path d="m11.875 7.5 1.25 0" stroke-width="1"></path></svg>