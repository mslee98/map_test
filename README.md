# 지도 서버 테스트


### Geo_server 
* GeoServer를 사용해 wms/wmts 등 여러 방법으로 이미지 변환 후 지도 서비스가 가능한지 테스팅
* GWC(Geoserver Tile Cache) 캐싱되지 않은 데이터들은 GIS데이터를 이미지로 변환하는 작업이 있어서 오래걸림 캐시기간을 가능한한 길게 설정 해야함

### Img_server 
* 바로 eMap 타일 별 이미지 데이터를 통해 이미지를 통해 데이터를 지도 서비스가 가능한지 테스팅
* Leafet.js으로 테스팅했으며 Proj 5179로 변경해서 사용하는데 지리정보원에서 제공한 Origin과 약간의 오차가 있음

# 지도 기능 테스트

### Naver_map
* 사용자 위치에 따른 특정 건물 탐색을 위한 테스트 용도 
* 결제 필요
    * Web Dynamic Map - 월 9백만 회 무료
    * Geocoding - 월 3백만 회 무료
    * Reverse Geocoding - 월 3백만 회 무료
    * Direction 15 - 월 6천회 무료

### Leaflet_cluster_ex
* Leaflet 마커 클러스터링 테스팅
* Polygon 테스팅
![Document_-_Chrome_2023-03-06_16-29-24_AdobeExpress](https://user-images.githubusercontent.com/94597019/223048148-cd01df0f-83f0-4cfe-ace0-a2e5b9088892.gif)


# 3D 지도 테스트

### Qgis-three.js pulgin
* Qgis Three.js pulgin 사용 데이터 불러오는데 너무 오래걸림, 데이터는 국가오픈마켓에서 구할 수 있으며 "대전광역시"만을 표현

### Nextzen GeoJson 데이터 
* 위도 경도에 맞게 GeoJson 데이터를 받아와서 각 Feature(건물, 도로 등) 그림, 건물의 높이 데이터를 받아올 순 없어서 확인해봐야하며
* 가장 최신버전임 3d_map_ex파일을 참고해서 만듬

### 실내지도 테스트용(Indoor Map)
* 실내지도 테스트용으로 자료만 참고해 뒀음
