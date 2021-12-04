import React, {
  Children,
  EffectCallback,
  Fragment,
  FunctionComponent,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import styled from 'styled-components';

import { device } from '../helpers/device';

const onRenderWrapper = (status: Status) => {
  return (
    <Canvas>
      <h1>{status}</h1>
    </Canvas>
  );
}

const GMap: FunctionComponent = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(3);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: -70.9,
    lng: 42.35
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    setClicks([...clicks, e.latLng!]);
  }

  const onIdle = (m: google.maps.Map) => {
    console.log('onIdle', m);
  }

  return (
    <Wrapper
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
      render={onRenderWrapper}
    >
      <Map
        center={center}
        onClick={onClick}
        onIdle={onIdle}
        zoom={zoom}
        style={{
          borderRadius: '8px'
        }}
      >
        {clicks.map((latLng, i) => (
          <Marker key={i} position={latLng} />
        ))}
      </Map>
    </Wrapper>
  );
}

interface MapProps extends google.maps.MapOptions {
  style: {
    [key: string]: string;
  };
  onClick: (e: google.maps.MapMouseEvent) => void;
  onIdle: (map: google.maps.Map) => void;
}

const Map: FunctionComponent<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const m = new window.google.maps.Map(ref.current, {});
      setMap(m);
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach(eventName => {
        google.maps.event.clearListeners(map, eventName);
      });
      if (onClick) {
        map.addListener('click', onClick);
      }
      if (onIdle) {
        map.addListener('idle', onIdle);
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <Fragment>
      <Canvas ref={ref} style={style} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { map });
        }
      })}
    </Fragment>
  )
}

const Canvas = styled.div`
  width: 100%;
  height: 120px;
  @media ${device.mobileM} {
    height: 160px;
  }
  @media ${device.mobileL} {
    height: 200px;
  }
  @media ${device.tablet} {
    height: 240px;
  }
  @media ${device.laptop} {
    height: 280px;
  }
  @media ${device.desktop} {
    height: 320px;
  }
`;

const Marker: FunctionComponent<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    }
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
}

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a: any, b: any) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof google.maps.LatLng
  ) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
  }
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: EffectCallback,
  dependencies: any[]
) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default GMap;
