import { useEffect, useState } from "react";
import { OrbitingCircles } from "./OrbitingCircles";

export function OrbitingCirclesCodeBoard({ className }) {
  const [circleRadius, setCircleRadius] = useState(40);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 768) {
        setCircleRadius(40);
      } else if (windowWidth >= 768 && windowWidth < 1024) {
        setCircleRadius(80);
      } else {
        setCircleRadius(130);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-background ${className}`}
    >
      <span className="text-4xl font-semibold leading-none text-center text-transparent whitespace-pre-wrap pointer-events-none lg:text-6xl bg-gradient-to-b from-black to-gray-300 bg-clip-text xl:text-7xl dark:from-white dark:to-black">
        CODEBOARD
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className=" size-[20px] md:size-[30px]  lg:size-[35px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={circleRadius}
      >
        <Icons.canvas />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[35px] md:size-[45px] lg:size-[50px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={circleRadius + 50}
      >
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFTElEQVR4nO2c328UVRTHJ/ZvgJ2NWudO2+12SzGEpJBusZgYSdtFkDbioz9iDHVLKaCoEcaYAlVaXSy2jIghKUYfiMWfPCiE8EMTQn+igXa1YKLGKDL4pr4ccmaYbqtd2ma7nTN3zic5SR92Z+fez9xzp+3OV1EYhmEYhmEYhmEYhmEYhmEYhmEYxu8sWlRcpKqiXVXFkBrWbqphAXKUdtMek6rtXby4UFd8QAGerBrW/vV+8kReK6Rq/6iqthvHrBClQFXFcfeEG+ICPmgWcLFNwEi7HHWxTcDRZh02xCeLER+TlOKsDAGF9zoiLFOXuo426/ZYbSlhrU2htmfYSzicXcafB3W41K7nfJWOdkw9/i9duR9zNjX+1v/H1JvUJ9oXqT3F3sBvt6lsV9R3r+uwOZF7Pb9ehxsHM8c91irm5bgzVeMqAbWVAr7YMXVcDW77UrU9ChWcuymnv3rdSqw8VrrT2T++fHFq67q9lwwqVFDD2l94UgO7vZ80awGk1K3IdIL+tgkhlkIF945jtMP7CbNyKGyFOOEzva6hWsC1lPPzWIcjBEuhggxCDjxdDJHiUqiILYGySCkcaSrK+tpNdc6eyELM/Mh45bEIPBCvgvNnT8C18UE4feozWLb0fvjqZRYCXsioqY7DyNAZW4Zbb3a2Q/KRMl4hFgEZWD3dKXimPiaHkOs9OgztpS+jvHwpfHPOaVOTa+zKBVhdHYcPN0vSsvBk8aS9nnQrS+3ElRGPw5aWJNSsfgguDZ+dImNdog6erY9mfT8LMedPhvF4ib2BDw86bWr79lZbSnr0gl2N6xPwxJoo/NGT/RgsxMyPDLfeO9QFl7//1pbx5AwyWIiZXxlY7sqYjQwWYtKSwUJMWjJYiElLBgsxaclgISYtGSzEpCWDhZi0ZLAQc/5kPDUPMliISUsGCzFpyfClkN+7dThnyCnD8qOQhSjDIxksxKQlw5dC8Ks0LzUIT2Vcz5MMXwrJ138MDQIyWIhJSwYLMWnJCLwQg5iMQAsxCMoIrBCDqIxACjEIywicEGMWMjYlyuxH5LyQESghhg9kBEbIro0l9tc7p/vis/v1TgoyAiEE/zKMz2OMZJVRS0ZGIIQ0PhiD/ak3SLepwAjp26bD3fcUwcmvP5lWRlMiSkqG9EIS1TFIJpugomI5nDr5qS1jsP80rKuvJSlDaiGfv6BDVWUl/Jjut59YWlKxHFq3NEM0EoWdGyMkZUgt5OGVMXj/cDeM/9APhw8dgFi0HDbUlMIw8aevpBRyfJtu3+b29r4L8RWVsHZVDM7s8n6yAyvkSJOAkqJSiC+LQd9W7yfZmkMl6wRc2SeZEKyBPc4Dol5PsDXH+u2dzM9SCZGhxmQRglFHucbsqcRKoQILEf4XIkuNydKy/Fx9W3X4tYuFAJXy3e8hV1PCzij0euKsPJUPAsyc9GqMu3NPGmPwZpPO5rdKd+pQvzJzsWGWL449pIobCuUQTEzvxMBImaSkO3V4tErAiR3TRcWKAYVaiDIKmDwATO/ElYJL/E4RrOdfFQsS+/pRS+b5lZa1c3svjgFXxmQZWCjIbllO7DgNMETYDVKeLioW95Q7hRTjBC1EMPLPb2c+5/K+uX0OjuG/4+p9biJI+e9QqFAolMArBE8O47dxGXvdXqw8F8rIRI2L1xSCFGAwvXvHge0LVwtuenh1/bRf93VdTTlh/HixTbQpJ/f9mKIodylEKcBgerd9yVwhbFPOyiArYwLsp5iFjvHbmPgsjwRh4d2UPbbQfZrX88wwDMMwDMMwDMMwDMMwDMMwDMMwSq7cAjWb4i/YoRuxAAAAAElFTkSuQmCC"></img>
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className=" size-[40px] lg:size-[50px] border-none bg-transparent"
        radius={circleRadius + 100}
        duration={20}
        reverse
      >
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFd0lEQVR4nO2c608cVRjGSbgsRagiUBspbbnNHzCQBlBKsaC11lSDprap8VITTWptvFJNTfjQxkaNNbFIWimCaaGCcmmBQl035ZYWCrtWWmZxh0RjNCYajTE2Rmtfc47dCXvfYXc5y+zzJM+nPZmdfX5z3vOes5uNi4MgCIIgCIIgCIIgCIIgA2tKUYusiuMVm12thVWPDFg2LKNFg2FTHNdtdpVg1XcGiuP65RmHHHEgVvvcPoBQg3oYWVYRB2JTHHUAogZXHRRHnTAgl67MkmXCRiPWaR9Pi0rDU1+TZeIrmpz5JjbKnSIIiPmilY609dD7Jzq5m3sG6dLVWe318WmFjncNaK/Xf3qGzk9eFh+Y3YBA2MyYD8PpjnND2piT/V96vN7QfoasikN8aHaDAWFlyj1s5mOf9WljvAFjHrV5L282o1gEkBHrFa9hf9w9qI052tHrdcz4tF18aHaDAWFlh60Z7mGfuzCljekdHvd4/USfWXxgdgMCYWYLOFszWJlq6h5wgeF0/8gENXUN0LHP+6jTPEpTsdBpKQLbXlgFEFu0PwiYIap4CACiig8+moA0nmynoopquKKaZyEcSENLK0lyCSyX8CwARI6ehwFAZPEQAEQWHzyAyOLDBhBZfMAAIosPFUCiIEgJQMSHJwGI+MAkABEfkgQgAkMpKqWVuw/Syj2HNOeX34cZIgrI2gd3UvwYaU60XKPCdesBRBSQrNp6FyBpR0dRskTW8FuarS5A7tj7DoCIglFQtpEShv9xAZJ7bw2AiAKS/fTrLjCWdX676Pdg+OP3wnXlQY9Nf7fHBUjGgVMhXxNA5P9DyF+/iTLrPqGMA21Bh2Lq+8kFSM72F7yOyzh4itLf7qL88k0AEijUgtJK3iklWv7kod7+VkfY2112TTYm6Yvf+XuFc8YYpmSxUNgmLmngV5dggwWip911AtHWmq7v6M5dbwAID6i4jIeRfPoHl5DidQLR0+66A3E69fgEn2kxO0NyduyhZe0Or+HE6wCit931BYR75F+67XA/5Vdsjh0gOdt2U0rrVb8g4lkw7/VT3satAa+X/dQ+jxLkb3xu1UN06xEzxY/e8Pn+ieY/aMWrH+heX5YckOUNQ/5BjBGlfXRBV+kItt119+pHnqWUthm/95Lc/T1lP/macYEkDf7m88OzcHIee153mQi23fXqolK+hpl6Xa8x3+yeYwoIC4N1WGyBlwSd7haWbKCs/Y2UcP4vAGE1P2fHXt0hSmE+3c2trqHUlqnYAmI6+4vP0rC83hLUIj7f7gEu5HS3oPQeyqxroYShv2OvZK29fxulNk/67m4s1yir9sOguhuv7W61jtPd4jL+7aK/h4RBynyzybhAnGYLqfuu3L27WbXzxYid7q55eBelnJz222HxjeLm7bo+15IFwpx/dzU/5GN7Dl+hZNXWh73dZfsLfyDYmhboYTAkEK2MbX2CUlpndO/UTQtsd33t1Hm53N8Y0mGjIYAwFxbfRSteOqyd8gYCEkq76wFk9AY/Lsnb8EDIn8MwQJzOq9zCwwkEJJR2dz4QthldU/NM2O7fcECkm171+MuUfPpHn0BC+TEDu6bp7M8L3ozGJBDp5u6ZnTeFu91d/ehzfO8RiXs2NBApTKe7i+mYBJLu0e4G/707gEQgBFMop7uYIeENIa9yC99BO53WeHFRf7uLkiWLDxlAZPHBAkgUhCkBiPgAJQARH5oEIOKDkgBEfDgSgIgPRAIQ/IGZFOtnWVIUG0Bk8RAARBYfPIDI4sMGEFl8wEsSiHlsgt8I3MqzEA4EVqPrn61hFUBsS+VBWIwZYp2dq7IqjkOwI3AGs3NVEQcCQRAEQRAEQRAEQRAEQXFi9B8Co37lKFLmBwAAAABJRU5ErkJggg=="></img>
      </OrbitingCircles>
    </div>
  );
}

const Icons = {
  canvas: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <path
        d="M17.434,94.862c-2.212,0-4.297-0.866-5.87-2.438c-2.092-2.091-2.909-5.052-2.186-7.92l7.849-31.167 c0.61-2.417,1.862-4.622,3.621-6.381l35.914-35.914c1.226-1.228,2.859-1.904,4.595-1.904c1.732,0,3.361,0.674,4.589,1.896 l27.023,26.968c1.213,1.211,1.908,2.888,1.908,4.6c0,1.737-0.676,3.369-1.903,4.597L57.049,83.138 c-1.774,1.771-3.98,3.023-6.392,3.632l-31.181,7.838C18.811,94.776,18.121,94.862,17.434,94.862z"
        opacity=".35"
      ></path>
      <path
        fill="#f2f2f2"
        d="M15.434,92.862c-2.212,0-4.297-0.866-5.87-2.438c-2.092-2.091-2.909-5.052-2.186-7.92l7.849-31.167 c0.61-2.417,1.862-4.622,3.621-6.381L54.761,9.043c1.226-1.228,2.859-1.904,4.595-1.904c1.732,0,3.361,0.674,4.589,1.896 l27.023,26.968c1.213,1.211,1.908,2.888,1.908,4.6c0,1.737-0.676,3.369-1.903,4.597L55.049,81.138 c-1.774,1.771-3.98,3.023-6.392,3.632l-31.181,7.838C16.811,92.776,16.121,92.862,15.434,92.862z"
      ></path>
      <path
        fill="#fedeb3"
        d="M26.586,46.41l-3.142,3.142c-0.93,0.93-1.591,2.096-1.914,3.372L15.5,76.879l7.549,7.621 l24.019-6.033c1.276-0.322,2.442-0.983,3.374-1.914l3.162-3.179L26.586,46.41z"
      ></path>
      <path
        fill="#40396e"
        d="M16.658,75.128l-2.765,10.965l10.962-2.764L16.658,75.128z"
      ></path>
      <path
        fill="#f9b84f"
        d="M59.358,13.638l-35.23,35.23c3.394,1.324,5.808,4.604,5.808,8.466c0,0,0,0.408,0,0.91 s0.408,0.91,0.91,0.91s0.91,0,0.91,0c5.027,0,9.103,4.076,9.103,9.103l0,0l0,0c0,0,0,0.408,0,0.91c0,0.503,0.408,0.91,0.91,0.91 s0.91,0,0.91,0l0,0c3.853,0,7.126,2.401,8.457,5.781l35.239-35.257L59.358,13.638z"
      ></path>
      <path
        fill="#ffc571"
        d="M30.201,58.889l37.211-37.211l-8.055-8.04l-35.23,35.23c3.394,1.324,5.808,4.604,5.808,8.466 c0,0,0,0.408,0,0.91C29.936,58.496,30.038,58.723,30.201,58.889z"
      ></path>
      <path
        fill="#ef8630"
        d="M41.125,69.813c0.166,0.164,0.393,0.266,0.645,0.266c0.503,0,0.91,0,0.91,0l0,0 c3.853,0,7.126,2.401,8.457,5.781l35.239-35.257l-8.027-8.013L41.125,69.813z"
      ></path>
      <path
        fill="#40396e"
        d="M15.434,87.862c-0.867,0-1.702-0.341-2.336-0.975c-0.834-0.834-1.16-2.016-0.872-3.16l3.828-15.179 c0.006-0.036,0.014-0.072,0.023-0.108l3.999-15.882c0.389-1.54,1.187-2.945,2.308-4.066l35.914-35.914 c0.585-0.586,1.534-0.585,2.12-0.001l18.991,18.952l0,0l0.001-0.001l0,0l8.027,8.013c0.282,0.281,0.44,0.663,0.44,1.061 c0,0.398-0.158,0.78-0.439,1.062L52.198,76.92c-0.024,0.024-0.05,0.048-0.076,0.07l-0.617,0.62 c-1.126,1.125-2.533,1.923-4.07,2.311l-15.89,4.001c-0.071,0.018-0.144,0.03-0.216,0.037l-15.071,3.8 C15.983,87.828,15.707,87.862,15.434,87.862z M19.012,69.069c-0.006,0.037-0.014,0.073-0.023,0.11l-3.854,15.282 c-0.037,0.146,0.025,0.246,0.083,0.305c0.058,0.058,0.159,0.117,0.306,0.084l15.265-3.849c0.072-0.019,0.145-0.031,0.217-0.038 l15.695-3.952c1.013-0.255,1.94-0.781,2.68-1.521l0.69-0.693c0.026-0.026,0.053-0.052,0.081-0.076l34.101-34.118L59.358,15.759 L24.504,50.613c-0.738,0.738-1.264,1.665-1.52,2.679L19.012,69.069z"
      ></path>
    </svg>
  ),
  notion: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
        fill="#ffffff"
      />
      <path
        d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
        fill="#000000"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  ),
  openai: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  ),
  googleDrive: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 87.3 78"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  ),
  whatsapp: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 175.216 175.552"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="b"
          x1="85.915"
          x2="86.535"
          y1="32.567"
          y2="137.092"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#57d163" />
          <stop offset="1" stopColor="#23b33a" />
        </linearGradient>
        <filter
          id="a"
          width="1.115"
          height="1.114"
          x="-.057"
          y="-.057"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="3.531" />
        </filter>
      </defs>
      <path
        d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
        fill="#b3b3b3"
        filter="url(#a)"
      />
      <path
        d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
        fill="#ffffff"
      />
      <path
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
        fill="url(#linearGradient1780)"
      />
      <path
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
        fill="url(#b)"
      />
      <path
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
        fill="#ffffff"
        fillRule="evenodd"
      />
    </svg>
  ),
};
