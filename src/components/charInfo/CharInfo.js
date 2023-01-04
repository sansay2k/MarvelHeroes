import { useState, useEffect} from 'react';
import PropTypes from 'prop-types'; 

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();


    useEffect(() => {
        updateChar();
    }, [props.charId])

    // useEffect(() => {
    //     if (props.charId !== prevProps.charId) {
    //         updateChar();
    //     }
    // }, [prevProps])

    const updateChar = () => {
        
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }


    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <Viev char={char}/> : null;


    return (
        <div className="char__info">
            {spinner}
            {errorMessage}
            {skeleton}
            {content}
        </div>
    )

}

const Viev = ({char}) => {
        const {name, description, thumbnail, homepage, wiki, comics} = char;
        let imgStyle = {'objectfit' : 'cover'};
        if (thumbnail == 'http://http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectfit' : 'contain'}
        }
        return(
            <>
                <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics width this character'}
                    {
                    comics.map((item, i) => {
                        if (i < 10) {
                            return(
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        }
                    })
                    }

                    
                </ul>
            </>
        )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;