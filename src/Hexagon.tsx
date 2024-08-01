import { ComponentProps, JSX, splitProps } from 'solid-js';

export const Hexagon = (
  props: ComponentProps<'div'> & {
    children?: JSX.Element;
    svgProps?: JSX.SvgSVGAttributes<SVGSVGElement>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    pathClassList?: Record<string, boolean | undefined>;
  }
) => {
  const [_local, others] = splitProps(props, [
    'children',
    'svgProps',
    'pathClassList',
    'onMouseEnter',
    'onMouseLeave',
    'class',
  ]);
  return (
    <div class={`flex justify-center items-center ${props.class}`} {...others}>
      <svg
        {...props.svgProps}
        viewBox="0 0 84 84"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
          classList={props.pathClassList}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
        ></path>
      </svg>
      <div
        class="absolute flex flex-col justify-center items-center"
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        {props.children}
      </div>
    </div>
  );
};
