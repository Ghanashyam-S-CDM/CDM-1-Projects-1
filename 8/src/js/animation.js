const stages=[
	{ length: 8 },
	{ length: 4 },
	{ length: 2 },
	{ length: 10 },
]

let clock=0
let stage=0
let phase=0
let duration=0

{
	let start=0
	for(let stage of stages){
		stage.start=start
		start+=stage.length
	}
	duration=start
}
const animation=()=>{
	while(1){
		stageObj=stages[stage]
		phase=(clock-stageObj.start)/stageObj.length
		if(phase>1){
			stagedAnimation[stage](1)
			++stage
			stagedAnimation[stage](0)
			continue
		}
		if(phase<0){
			stagedAnimation[stage](0)
			--stage
			stagedAnimation[stage](1)
			continue
		}
		break
	}
	stagedAnimation[stage](phase)
}

const smootherStep=phase=>{
	let p=phase*phase*(3-2*phase)
	return (1-phase)*p+phase*phase*(2-phase)
}

const initAngle=geoData['china'].phiTheta.y
const hightlightAngle=30*piBy180
geoData['peru'].phiTheta.y-=Math.PI*2
const stagedAnimation=[
	/* 0 */ phase=>{
		group.rotation.y=initAngle-easeOutCubic(phase)*twoPi
		geoData['china'].material.opacity=phase
	},
	/* 1 */ phase=>{
		for(let country in arcs){
			setArcPhase(arcs[country],phase)
			setCountryTransparency(country,phase)
		}
	},
	/* 2 */ phase=>{
		for(let country in arcs){
			let displacement=group.rotation.y-geoData[country].phiTheta.y
			let p=Math.abs(displacement/hightlightAngle)
			if(p<=1){
				p=(1-p)/2
				setCountryTransparency(country,p*phase)
				setArcPhase(arcs[country],p*phase)
			}
			if(displacement<0){
				p=.5
				setCountryTransparency(country,p*phase)
				setArcPhase(arcs[country],p*phase)
			}
		}
	},
	/* 3 */ phase=>{
		group.rotation.y=initAngle-easeInOutSine(phase)*twoPi
		for(let country in arcs){
			let displacement=group.rotation.y-geoData[country].phiTheta.y
			let p=Math.abs(displacement/hightlightAngle)
			if(p<=1){
				p=(1-p)/2
				setCountryTransparency(country,p)
				setArcPhase(arcs[country],p)
			}
			if(displacement<0){
				p=.5
				setCountryTransparency(country,p)
				setArcPhase(arcs[country],p)
			}
		}
	},
]

setArcPhase=(arc,phase)=>{
	phase*=4
	let l=arc.dots.length-1,p,scale
	for(let i=0;i<=l;++i){
		p=i/l
		if(phase<=2) scale=clamp(phase-p,0,1)
		else scale=clamp(4-phase-(1-p),0,1)
		scale=Math.round(scale)
		arc.dots[i].scale.set(scale,scale,scale)
	}
}

setCountryTransparency=(country,phase)=>{
	let p=phase*2
	p=p<=1?p:2-p
	p*=2
	geoData[country].material.opacity=p
}